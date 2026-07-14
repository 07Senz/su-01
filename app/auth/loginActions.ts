"use client";

import { MemberRecord, MemberType } from "./AuthContext";

// NOTE: These helpers intentionally DO NOT implement any backend auth.
// They only preserve the existing in-memory auth logic from the former app/page.tsx.

export function memberNormalize(members: MemberRecord[]) {
  return members.map((m) => ({
    ...m,
    id: String(m.id).trim(),
    password: String(m.password),
  }));
}

export function adminNormalize(members: MemberRecord[]) {
  return members.map((m) => ({
    ...m,
    id: String(m.id).trim(),
    password: String(m.password),
  }));
}

export type { MemberType, MemberRecord };

