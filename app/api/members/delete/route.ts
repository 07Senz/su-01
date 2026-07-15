import { NextResponse } from "next/server";

import { getD1FromEnv } from "../_cf/d1";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const ADMIN_PASS = process.env.ADMIN_PASS ?? "";
  const adminPass = String((body as any).adminPass ?? "");
  if (!adminPass || adminPass !== ADMIN_PASS) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = String((body as any).id ?? "").trim();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const env = (req as any).env;
  const d1 = getD1FromEnv(env);

  await d1.prepare("DELETE FROM members WHERE id = ?1").bind(id).run();

  return NextResponse.json({ ok: true });
}

