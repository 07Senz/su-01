import { NextResponse } from "next/server";

import { getD1FromEnv } from "../_cf/d1";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Keep compatibility with the current client-side reset UI.
  // In production, you should protect this endpoint using a proper admin auth/session.
  const ADMIN_PASS = process.env.ADMIN_PASS ?? "";
  const adminPass = String((body as any).adminPass ?? "");
  if (!adminPass || adminPass !== ADMIN_PASS) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  const id = String((body as any).id ?? "").trim();
  const password = String((body as any).password ?? "");

  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  if (!password)
    return NextResponse.json({ error: "password is required" }, { status: 400 });

  const env = (req as any).env;
  const d1 = getD1FromEnv(env);

  // Reset password ONLY (memberType unchanged)
  await d1
    .prepare("UPDATE members SET password = ?2 WHERE id = ?1")
    .bind(id, password)
    .run();

  return NextResponse.json({ ok: true });
}

