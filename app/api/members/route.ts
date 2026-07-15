import { NextResponse } from "next/server";

export type MemberRecord = {
  id: string;
  password: string;
  memberType: "Core";
};



type D1Local = {
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
function getD1(req: Request): D1Local {
  // env is injected by the CF adapter at runtime; Request doesn't type it.
  const env = (req as any).env;
  // In local dev there is no CF adapter env binding.
  if (!env) {
    throw new Error('Missing Cloudflare D1 binding env (local dev requires CF adapter)');
  }
  return getD1FromEnv(env) as D1Local;
}



async function d1GetMembers(d1: D1Local): Promise<MemberRecord[]> {
  const rows = await d1
    .prepare("SELECT id, password, memberType FROM members ORDER BY id ASC")
    .all();

  // CF D1 returns different shapes depending on adapter.
  const results = (rows as any)?.results ?? (rows as any);
  const list = Array.isArray(results) ? results : (rows as any)?.results ?? [];

  return (list as any[]).map((r) => ({
    id: String(r.id),
    password: String(r.password ?? ""),
    memberType: "Core",
  }));
}



async function d1UpsertMembers(d1: D1Local, members: MemberRecord[]) {
  for (const m of members) {
    await d1
      .prepare(
        "INSERT INTO members (id, password, memberType) VALUES (?1, ?2, ?3)\n         ON CONFLICT(id) DO UPDATE SET password = excluded.password, memberType = excluded.memberType",
      )
      .bind(m.id, m.password, m.memberType)
      .run();
  }
}

export async function GET(req: Request) {
  const d1 = getD1(req);
  const members = await d1GetMembers(d1);
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
      // Roles removed; only Core is supported
      if (memberType !== "Core") return null;
      return { id, password, memberType: "Core" } as MemberRecord;

    })
    .filter(Boolean) as MemberRecord[];

  await d1UpsertMembers(d1, cleaned);
  return NextResponse.json({ ok: true, members: cleaned });
}

