import { NextResponse } from "next/server";

type MemberRecord = {
  id: string;
  password: string;
  memberType: "G.M" | "E.M" | "Core";
};

type D1Like = {
  prepare: (sql: string) => {
    bind: (...args: any[]) => {
      run: () => Promise<any>;
      all: () => Promise<any>;
    };
    all: () => Promise<any>;
  };
};

import { getD1FromEnv } from "../_cf/d1";

// Your Cloudflare adapter must call this route with `env` available.
// Next.js doesn't provide `env` automatically, so the adapter wiring is required.
function getD1(req: Request): D1Like {
  // @ts-expect-error - env is injected by CF adapter
  const env = (req as any).env;
  return getD1FromEnv(env);
}


async function d1GetMembers(d1: D1Like): Promise<MemberRecord[]> {
  const rows = await d1
    .prepare("SELECT id, password, memberType FROM members ORDER BY id ASC")
    .all();

  return (rows.results as any[]).map((r) => ({
    id: String(r.id),
    password: String(r.password ?? ""),
    memberType: r.memberType as MemberRecord["memberType"],
  }));
}

async function d1UpsertMembers(d1: D1Like, members: MemberRecord[]) {
  for (const m of members) {
    await d1
      .prepare(
        "INSERT INTO members (id, password, memberType) VALUES (?1, ?2, ?3)\n         ON CONFLICT(id) DO UPDATE SET password = excluded.password, memberType = excluded.memberType",
      )
      .bind(m.id, m.password, m.memberType)
      .run();
  }
}

export async function GET() {
  const d1 = getD1FromEnv((globalThis as any).env ?? (globalThis as any).cfEnv ?? ({}));
  // Fallback: if adapter injects req.env instead, update adapter accordingly.
  const members = await d1GetMembers(d1 as any);
  return NextResponse.json({ members });
}

export async function POST(req: Request) {
  const d1 = getD1(req);


  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const members = Array.isArray((body as any).members) ? (body as any).members : null;
  if (!members) {
    return NextResponse.json({ error: "members[] is required" }, { status: 400 });
  }

  const cleaned: MemberRecord[] = members
    .map((m: any) => {
      const id = String(m?.id ?? "").trim();
      const password = String(m?.password ?? "");
      const memberType = m?.memberType;
      if (!id) return null;
      if (memberType !== "G.M" && memberType !== "E.M" && memberType !== "Core") return null;
      return { id, password, memberType } as MemberRecord;
    })
    .filter(Boolean) as MemberRecord[];

  await d1UpsertMembers(d1, cleaned);
  return NextResponse.json({ ok: true, members: cleaned });
}

