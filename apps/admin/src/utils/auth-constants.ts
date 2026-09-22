export type UserRole = "admin" | "editor";

export const ADMIN_PASSWORD = process.env.PASSWORD ?? "";
export const EDITOR_PASSWORD = process.env.EDITOR_PASSWORD ?? "";
