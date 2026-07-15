import { NextResponse } from "next/server";

import { getD1FromEnv } from "../_cf/d1";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, id, password, adminPass, members } = body as any;

  // WARNING: demo-only auth.
  const ADMIN_PASS = process.env.ADMIN_PASS ?? "123";
  if (adminPass !== ADMIN_PASS) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !action ||
    (action !== "upsert" &&
      action !== "reset" &&
      action !== "delete" &&
      action !== "import")
  ) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const env = (req as any).env;
  const d1 = getD1FromEnv(env);

  const upsertOne = async (memberId: string, memberPassword: string) => {
    await d1
      .prepare(
        "INSERT INTO members (id, password, memberType) VALUES (?1, ?2, 'Core')\n         ON CONFLICT(id) DO UPDATE SET password = excluded.password, memberType = 'Core'",
      )
      .bind(memberId, memberPassword)
      .run();
  };

  if (action === "upsert") {
    const cleanId = String(id ?? "").trim();
    const cleanPass = String(password ?? "");

    if (!cleanId) return NextResponse.json({ error: "id is required" }, { status: 400 });

    await upsertOne(cleanId, cleanPass);
    return NextResponse.json({ ok: true });
  }

  if (action === "reset") {
    const cleanId = String(id ?? "").trim();
    const cleanPass = String(password ?? "");
    if (!cleanId) return NextResponse.json({ error: "id is required" }, { status: 400 });

    await d1
      .prepare("UPDATE members SET password = ?2, memberType = 'Core' WHERE id = ?1")
      .bind(cleanId, cleanPass)
      .run();

    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    const cleanId = String(id ?? "").trim();
    if (!cleanId) return NextResponse.json({ error: "id is required" }, { status: 400 });

    await d1.prepare("DELETE FROM members WHERE id = ?1").bind(cleanId).run();
    return NextResponse.json({ ok: true });
  }

  // action === "import"
  if (action === "import") {
    const list = Array.isArray(members) ? members : Array.isArray(body?.members) ? body.members : null;
    if (!list) {
      return NextResponse.json({ error: "members[] is required" }, { status: 400 });
    }

    for (const m of list) {
      const cleanId = String(m?.id ?? "").trim();
      if (!cleanId) continue;
      const cleanPass = String(m?.password ?? "");
      await upsertOne(cleanId, cleanPass);
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unhandled action" }, { status: 400 });
}

