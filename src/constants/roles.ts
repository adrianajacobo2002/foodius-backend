export const ROLES = {
  CLIENT: "CLIENT",
  BUSINESS: "BUSINESS",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
