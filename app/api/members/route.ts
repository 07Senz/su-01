import { NextResponse } from "next/server";
import { getD1FromEnv } from "../_cf/d1";

export type MemberRecord = {
  id: string;
  password: string;
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

function getD1(): D1Local {
  return getD1FromEnv() as D1Local;
}

async function d1GetMembers(d1: D1Local): Promise<MemberRecord[]> {
  const rows = await d1
    .prepare("SELECT id, password FROM members ORDER BY id ASC")
    .all();

  const results = (rows as any)?.results ?? (rows as any);
  const list = Array.isArray(results) ? results : [];

  return list.map((r: any) => ({
    id: String(r.id),
    password: String(r.password ?? ""),
  }));
}

async function d1UpsertMembers(
  d1: D1Local,
  members: MemberRecord[],
) {
  for (const m of members) {
    await d1
      .prepare(
        `INSERT INTO members (id, password, memberType)
         VALUES (?1, ?2, 'Core')
         ON CONFLICT(id) DO UPDATE SET
         password = excluded.password`,
      )
      .bind(m.id, m.password)
      .run();
  }
}

export async function GET() {
  const d1 = getD1();

  const members = await d1GetMembers(d1);

  return NextResponse.json({ members });
}

export async function POST(req: Request) {
  const d1 = getD1();

  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "InvalidJSON" },
      { status: 400 },
    );
  }

  const members = Array.isArray((body as any).members)
    ? (body as any).members
    : null;

  if (!members) {
    return NextResponse.json(
      { error: "members[] is required" },
      { status: 400 },
    );
  }

  const cleaned: MemberRecord[] = members
    .map((m: any) => {
      const id = String(m?.id ?? "").trim();
      const password = String(m?.password ?? "");

      if (!id) return null;

      return {
        id,
        password,
      };
    })
    .filter(Boolean) as MemberRecord[];

  await d1UpsertMembers(d1, cleaned);

  return NextResponse.json({
    ok: true,
    members: cleaned,
  });
}