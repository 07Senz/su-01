"use client";

import React, { useState } from "react";
import { FormPillButton } from "./FormPillButton";

export default function AdminLoginForm({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: () => void;
  adminId?: string;
}) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-[2rem] p-8 w-full max-w-sm">
      <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">
        Admin Login
      </h2>

      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <FormPillButton label="Admin" active={true} onClick={() => {}} />
      </div>

      <div className="flex flex-col gap-3">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          inputMode="numeric"
          placeholder="Admin ID"
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
        />

        {error && (
          <div className="text-[11px] font-bold text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-3 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all"
          >
            Back
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setError(null);
              if (!id.trim()) return setError("Admin ID is required");
              if (!password.trim()) return setError("Password is required");

              setBusy(true);
              try {
                const res = await fetch("/api/admin/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    adminId: id.trim(),
                    password,
                  }),
                });

                if (!res.ok) {
                  const data = await res.json().catch(() => null);
                  return setError(data?.error ?? "Unauthorized");
                }

                onSuccess();
              } catch {
                setError("Network error");
              } finally {
                setBusy(false);
              }
            }}
            className="flex-1 px-3 py-3 bg-slate-950 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-60"
          >
            {busy ? "Checking…" : "Enter"}
          </button>
        </div>
      </div>
    </div>
  );
}

