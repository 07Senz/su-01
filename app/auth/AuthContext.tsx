"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type MemberType = "Member" | "Core";

export type MemberRecord = { id: string; password: string; memberType: MemberType };


type AuthContextValue = {
  authedAdminId: string | null;
  setAuthedAdminId: React.Dispatch<React.SetStateAction<string | null>>;
  authedAdmin: boolean;
  setAuthedAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  authedMemberId: string | null;
  setAuthedMemberId: React.Dispatch<React.SetStateAction<string | null>>;

  // In-memory member store (admin adds members)
  members: MemberRecord[];
  setMembers: React.Dispatch<React.SetStateAction<MemberRecord[]>>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authedAdminId, setAuthedAdminId] = useState<string | null>(null);
  const [authedAdmin, setAuthedAdmin] = useState(false);
  const [authedMemberId, setAuthedMemberId] = useState<string | null>(null);

  const [members, setMembers] = useState<MemberRecord[]>([]);

  const value = useMemo<AuthContextValue>(
    () => ({
      authedAdminId,
      setAuthedAdminId,
      authedAdmin,
      setAuthedAdmin,
      authedMemberId,
      setAuthedMemberId,
      members,
      setMembers,
    }),
    [
      authedAdminId,
      authedAdmin,
      authedMemberId,
      members,
      // setters are stable
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

