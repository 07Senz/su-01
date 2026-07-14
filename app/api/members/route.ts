import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "app", ".server", "memberStore.json");

async function readStore() {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return {
      members: Array.isArray(parsed?.members) ? parsed.members : [],
    };
  } catch (e) {
    // If file doesn't exist or can't be parsed, treat as empty store.
    return { members: [] as any[] };
  }
}

async function writeStore(next: { members: any[] }) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(
    STORE_PATH,
    JSON.stringify({ members: next.members }, null, 2),
    "utf8",
  );
}

export async function GET() {
  const store = await readStore();
  return NextResponse.json(store);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const members = Array.isArray((body as any).members) ? (body as any).members : null;
  if (!members) {
    return NextResponse.json({ error: "members[] is required" }, { status: 400 });
  }

  // Minimal shape validation
  const cleaned = members
    .map((m: any) => {
      const id = String(m?.id ?? "").trim();
      const password = String(m?.password ?? "");
      const memberType = m?.memberType;
      if (!id) return null;
      if (memberType !== "G.M" && memberType !== "E.M" && memberType !== "Core") return null;
      return { id, password, memberType };
    })
    .filter(Boolean);

  await writeStore({ members: cleaned });
  return NextResponse.json({ ok: true, members: cleaned });
}

