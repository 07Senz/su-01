"use client";

import React, { useMemo, useState } from "react";

import type { MemberRecord } from "../../auth/AuthContext";

function MemberLoginGate({
  members,
  onSuccess,
  onBack,
}: {
  members: MemberRecord[];
  onSuccess: (memberId: string) => void;
  onBack: () => void;
}) {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const normalizedMembers = useMemo(() => {
    return (members ?? []).map((m) => ({
      id: String(m.id).trim(),
      password: String(m.password ?? ""),
      memberType: m.memberType,
    }));
  }, [members]);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-[2rem] p-8 w-full max-w-sm">
      <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">
        Member Login
      </h2>

      <div className="text-[11px] text-slate-500 font-medium mb-1">
        Login with Member ID + Password
      </div>


      <div className="flex flex-col gap-3">
        <input
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          placeholder="# ID"
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
            onClick={() => {
              setError(null);
              if (!memberId.trim()) return setError("# ID is required");

              const match = normalizedMembers.find((m) => m.id === memberId.trim());
              if (!match) return setError("Member not found");
              if (match.password !== password) return setError("Incorrect Password");

              onSuccess(match.id);
            }}
            className="flex-1 px-3 py-3 bg-slate-950 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MemberLoginForm(props: {
  members: MemberRecord[];
  onBack: () => void;
  onSuccess: (memberId: string) => void;
}) {
  return <MemberLoginGate {...props} />;
}

