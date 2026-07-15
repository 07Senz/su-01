import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "app", ".server", "memberStore.json");

async function readStore() {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return { members: Array.isArray(parsed?.members) ? parsed.members : [] };
  } catch {
    return { members: [] as any[] };
  }
}

async function writeStore(members: any[]) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(
    STORE_PATH,
    JSON.stringify({ members }, null, 2),
    "utf8",
  );
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, id, password, adminPass } = body as any;



  // WARNING: this is only for this demo app.
  const ADMIN_PASS = process.env.ADMIN_PASS ?? "123";
  if (adminPass !== ADMIN_PASS) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!action || (action !== "upsert" && action !== "reset" && action !== "delete" && action !== "import")) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }


  const store = await readStore();
  let members = store.members;

  if (action === "upsert") {
    const cleanId = String(id ?? "").trim();
    const cleanPass = String(password ?? "");

    if (!cleanId) return NextResponse.json({ error: "id is required" }, { status: 400 });

    // Roles removed; only Core is supported. Ignore any incoming memberType.
    const idx = members.findIndex((m: any) => String(m?.id ?? "").trim() === cleanId);
    const next = { id: cleanId, password: cleanPass, memberType: "Core" };

    if (idx >= 0) members = members.map((m: any, i: number) => (i === idx ? next : m));
    else members = [...members, next];
  }


  if (action === "reset") {
    const cleanId = String(id ?? "").trim();
    const cleanPass = String(password ?? "");
    if (!cleanId) return NextResponse.json({ error: "id is required" }, { status: 400 });

    members = members.map((m: any) =>
      String(m?.id ?? "").trim() === cleanId ? { ...m, password: cleanPass } : m,
    );
  }

  await writeStore(members);
  return NextResponse.json({ ok: true, members });
}

