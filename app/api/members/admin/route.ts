import { NextResponse } from "next/server";
import { getD1FromEnv } from "../../_cf/d1";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "InvalidJSON" }, { status: 400 });
  }

  const { action, id, password, members } = body as any;

  const ADMIN_PASS = process.env.ADMIN_PASS ?? "";

  if (!ADMIN_PASS) {
    return NextResponse.json(
      { error: "ADMIN_PASS not configured" },
      { status: 500 },
    );
  }

  const adminAuth = req.headers.get("x-admin-pass") ?? "";

  if (!adminAuth || adminAuth !== ADMIN_PASS) {
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

  const d1 = getD1FromEnv();

  const upsertOne = async (
    memberId: string,
    memberPassword: string,
    memberName?: string,
  ) => {
    const nameValue = memberName && memberName.trim() ? memberName.trim() : memberId;

    await d1
      .prepare(
        `INSERT INTO members (id, password, name, memberType)
         VALUES (?1, ?2, ?3, 'Core')
         ON CONFLICT(id) DO UPDATE SET
         password = excluded.password,
         name = excluded.name`,
      )
      .bind(memberId, memberPassword, nameValue)
      .run();
  };

  if (action === "upsert") {
    const cleanId = String(id ?? "").trim();
    const cleanPass = String(password ?? "");
    const cleanName = String((body as any).name ?? "");

    if (!cleanId) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await upsertOne(cleanId, cleanPass, cleanName);

    return NextResponse.json({ ok: true });
  }

  if (action === "reset") {
    const cleanId = String(id ?? "").trim();
    const cleanPass = String(password ?? "");

    if (!cleanId) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await d1
      .prepare("UPDATE members SET password = ?2 WHERE id = ?1")
      .bind(cleanId, cleanPass)
      .run();

    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    const cleanId = String(id ?? "").trim();

    if (!cleanId) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await d1.prepare("DELETE FROM members WHERE id = ?1").bind(cleanId).run();

    return NextResponse.json({ ok: true });
  }

  if (action === "import") {
    const list = Array.isArray(members) ? members : null;

    if (!list) {
      return NextResponse.json({ error: "members[] is required" }, { status: 400 });
    }

    for (const m of list) {
      const cleanId = String(m?.id ?? "").trim();
      if (!cleanId) continue;
      const cleanPass = String(m?.password ?? "");
      const cleanName = String(m?.name ?? "");
      await upsertOne(cleanId, cleanPass, cleanName);
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unhandled action" }, { status: 400 });
}