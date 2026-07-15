import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { adminId, password } = body as {
    adminId?: string;
    password?: string;
  };

  // Temporary admin login
const ADMIN_ID = "005";
const ADMIN_PASS = "2006";

  if (!ADMIN_ID || !ADMIN_PASS) {
  return NextResponse.json(
    { error: "ADMIN_ID/ADMIN_PASS not configured" },
    { status: 500 },
  );
}

  // Admin is numbers only (normalize any accidental non-digits)
  const cleanAdminId = String(adminId ?? "").replace(/\D+/g, "").trim();
  const cleanPassword = String(password ?? "");

  if (!cleanAdminId) {
    return NextResponse.json({ error: "adminId is required" }, { status: 400 });
  }
  if (!cleanPassword) {
    return NextResponse.json({ error: "password is required" }, { status: 400 });
  }

  const ok = cleanAdminId === String(ADMIN_ID) && cleanPassword === ADMIN_PASS;
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}

