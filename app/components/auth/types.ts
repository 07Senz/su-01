export type MemberType = "Member" | "Core";

// Note: this UI-level type is intentionally different from the D1-level
// memberType enum ("G.M" | "E.M" | "Core").
export type MemberRecord = {
  id: string;
  password: string;
  memberType: MemberType;
};

