"use client";

import React, { useMemo, useState } from "react";


import type { MemberRecord } from "../../auth/AuthContext";

type MemberType = MemberRecord["memberType"];

const ADMIN_PASS_FALLBACK = "123";

async function apiGetMembers(): Promise<MemberRecord[]> {
  const res = await fetch("/api/members", { method: "GET" });
  if (!res.ok) return [];
  const data = await res.json().catch(() => null);
  return Array.isArray(data?.members) ? data.members : [];
}

async function apiAdminRequest(payload: any): Promise<MemberRecord[]> {
  const res = await fetch("/api/members/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) return [];
  return apiGetMembers();
}

async function apiUpsertMember(input: {
  id: string;
  password: string;
}): Promise<MemberRecord[]> {
  return apiAdminRequest({
    action: "upsert",
    id: input.id,
    password: input.password,
    memberType: "Core",
    adminPass: ADMIN_PASS_FALLBACK,
  });
}

async function apiDeleteMember(input: { id: string }): Promise<MemberRecord[]> {
  return apiAdminRequest({
    action: "delete",
    id: input.id,
    adminPass: ADMIN_PASS_FALLBACK,
  });
}

async function apiResetPassword(input: {
  id: string;
  password: string;
}): Promise<MemberRecord[]> {
  return apiAdminRequest({
    action: "reset",
    id: input.id,
    password: input.password,
    adminPass: ADMIN_PASS_FALLBACK,
  });
}

async function apiImportMembers(input: {
  members: Array<{ id: string; password: string }>;
}): Promise<MemberRecord[]> {
  return apiAdminRequest({
    action: "import",
    adminPass: ADMIN_PASS_FALLBACK,
    members: input.members,
  });
}

async function apiExportMembers(): Promise<MemberRecord[]> {
  return apiGetMembers();
}

export default function AdminPanelForm({
  members,
  setMembers,
  onLogout,
}: {
  members: MemberRecord[];
  setMembers: React.Dispatch<React.SetStateAction<MemberRecord[]>>;
  onLogout: () => void;
}) {
  type AdminSection = "Manage" | "Reset" | "ImportExport" | "Theme";
  const [section, setSection] = useState<AdminSection>("Manage");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  const [error, setError] = useState<string | null>(null);

  // Manage (upsert)
  const [name, setName] = useState("");
  const [formId, setFormId] = useState("");
  const [batch, setBatch] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [other, setOther] = useState("");
  const memberType: MemberType = "Core";

  // Reset
  const [resetFormId, setResetFormId] = useState("");
  const [resetNewPass, setResetNewPass] = useState("");

  // Import/export
  const [importText, setImportText] = useState<string>("");
  const [importError, setImportError] = useState<string | null>(null);

  const membersSorted = useMemo(() => {
    return [...(members ?? [])].sort((a, b) => a.id.localeCompare(b.id));
  }, [members]);

  return (
    <div className="py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 font-mono">
              ADMIN PANEL
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-950 mt-1">
              {section === "Manage"
                ? "Member management"
                : section === "Reset"
                  ? "Reset Password"
                  : section === "ImportExport"
                    ? "Import / Export"
                    : "Theme"}
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              {section === "Manage"
                ? "Add or edit Core members (upsert)."
                : section === "Reset"
                  ? "Reset member password by ID."
                  : section === "ImportExport"
                    ? "Export members as JSON, and import back."
                    : "Switch dark/light theme."}
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 bg-slate-950 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-sm"
          >
            Logout
          </button>
        </div>

        <div className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-6">
          <div className="md:hidden flex items-center justify-between mb-5">
            <button
              type="button"
              className="px-4 py-2 bg-slate-950 text-white text-xs font-bold rounded-xl"
              onClick={() => {
                setSection((prev) => {
                  const order: AdminSection[] = [
                    "Manage",
                    "Reset",
                    "ImportExport",
                    "Theme",
                  ];
                  const idx = order.indexOf(prev);
                  return order[(idx + 1) % order.length];
                });
              }}
            >
              Section: {section}
            </button>
          </div>

          <div className="hidden md:flex gap-3 mb-6 flex-wrap">
            {(
              [
                { key: "Manage", label: "Members" },
                { key: "Reset", label: "Reset" },
                { key: "ImportExport", label: "Import/Export" },
                { key: "Theme", label: "Theme" },
              ] as const
            ).map((it) => (
              <button
                key={it.key}
                type="button"
                onClick={() => setSection(it.key)}
                className={
                  section === it.key
                    ? "px-4 py-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 text-white text-xs font-extrabold"
                    : "px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold"
                }
              >
                {it.label}
              </button>
            ))}
          </div>

          {section === "Manage" && (
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);

                if (!formId.trim()) return setError("Member ID is required");
                if (!pass.trim()) return setError("Password is required");

                (async () => {
                  const next = await apiUpsertMember({
                    id: formId.trim(),
                    password: pass.trim(),
                  });
                  if (!next.length) return setError("Failed to save member");
                  setMembers(next);

                  setName("");
                  setFormId("");
                  setBatch("");
                  setEmail("");
                  setPass("");
                  setOther("");
                })().catch(() => setError("Failed to save member"));
              }}
            >
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Name (UI only)
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                />
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Member ID
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  placeholder="e.g. 005"
                />
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </div>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Set member password"
                />
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Member type
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 focus:outline-none text-xs"
                  value={memberType}
                  readOnly
                />
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Batch (UI only)
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="2026-xx"
                />
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Email (UI only)
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                />
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Other (UI only)
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div className="md:col-span-2">
                {error && (
                  <div className="text-[11px] font-bold text-red-600 mb-3">{error}</div>
                )}
                <button
                  type="submit"
                  className="w-full px-5 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-xs font-extrabold rounded-xl hover:opacity-95 transition-all shadow-sm"
                >
                  Save member info
                </button>
              </div>
            </form>
          )}

          {section === "Reset" && (
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);

                if (!resetFormId.trim()) return setError("ID is required");
                if (!resetNewPass.trim()) return setError("New password is required");

                (async () => {
                  const next = await apiResetPassword({
                    id: resetFormId.trim(),
                    password: resetNewPass.trim(),
                  });
                  if (!next.length) return setError("Reset failed");
                  setMembers(next);
                  setResetNewPass("");
                })().catch(() => setError("Reset failed"));
              }}
            >
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Member ID
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={resetFormId}
                  onChange={(e) => setResetFormId(e.target.value)}
                  placeholder="e.g. 005"
                />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  New password
                </div>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={resetNewPass}
                  onChange={(e) => setResetNewPass(e.target.value)}
                  placeholder="New password"
                />
              </div>
              <div className="md:col-span-2">
                {error && (
                  <div className="text-[11px] font-bold text-red-600 mb-3">{error}</div>
                )}
                <button
                  type="submit"
                  className="w-full px-5 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-xs font-extrabold rounded-xl hover:opacity-95 transition-all shadow-sm"
                >
                  Reset Password
                </button>
              </div>
            </form>
          )}

          {section === "ImportExport" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Export (JSON)
                </div>
                <button
                  type="button"
                  className="w-full px-5 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-xs font-extrabold rounded-xl hover:opacity-95 transition-all shadow-sm"
                  onClick={async () => {
                    const list = await apiExportMembers();
                    const blob = new Blob([JSON.stringify(list, null, 2)], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `members-export-${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download members.json
                </button>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Import (JSON)
                </div>
                <textarea
                  className="w-full min-h-[140px] px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder='Paste JSON array: [{"id":"005","password":"..."}]'
                />

                {importError && (
                  <div className="text-[11px] font-bold text-red-600 mt-2">{importError}</div>
                )}

                <button
                  type="button"
                  className="mt-3 w-full px-5 py-3 bg-slate-950 text-white text-xs font-extrabold rounded-xl hover:bg-slate-800 transition-all shadow-sm"
                  onClick={async () => {
                    setImportError(null);
                    try {
                      const parsed = JSON.parse(importText || "[]");
                      if (!Array.isArray(parsed)) {
                        setImportError("Import JSON must be an array");
                        return;
                      }
                      const members = parsed
                        .map((x: any) => ({
                          id: String(x?.id ?? "").trim(),
                          password: String(x?.password ?? ""),
                        }))
                        .filter((m: any) => m.id && m.password);

                      const next = await apiImportMembers({ members });
                      if (!next.length && members.length > 0) {
                        setImportError("Import failed");
                        return;
                      }
                      setMembers(next);
                      setImportText("");
                    } catch {
                      setImportError("Invalid JSON");
                    }
                  }}
                >
                  Import & sync
                </button>
              </div>
            </div>
          )}

          {section === "Theme" && (
            <div className="flex flex-col md:flex-row gap-4 md:items-start">
              <div className="flex-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Theme
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setThemeMode("dark")}
                    className={
                      themeMode === "dark"
                        ? "px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-extrabold"
                        : "px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-50"
                    }
                  >
                    🌙 Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMode("light")}
                    className={
                      themeMode === "light"
                        ? "px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-extrabold"
                        : "px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-50"
                    }
                  >
                    ☀️ Light
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 mt-4">UI-only toggle.</div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Members
            </div>

            {membersSorted.length === 0 ? (
              <div className="text-xs text-slate-500 font-medium">No members yet.</div>
            ) : (
              <div className="space-y-2">
                {membersSorted.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-slate-100 bg-white"
                  >
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">{m.id}</div>
                      <div className="text-[10px] text-slate-400 font-bold">Stored</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-[11px] font-extrabold hover:bg-slate-50"
                        onClick={async () => {
                          const next = await apiDeleteMember({ id: m.id });
                          if (next.length) setMembers(next);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


