// import jwt from "jsonwebtoken";
// import { env } from "@repo/env/admin"

import { cookies } from "next/headers";

export const ADMIN_PASSWORD = "123";
export async function isLoggedIn() {
  const userCookies = await cookies();

  // ASSIGNMENT 2
  // check only that "auth_token" cookie exists
  return userCookies.has("auth_token");

  // ASSIGNMENT 3
  // check that auth_token cookie exists and is valid
  // const token = userCookies.get("auth_token")?.value;

  // return token && jwt.verify(token, env.JWT_SECRET || "");
}

export async function signIn(password: string) {
  if (password !== ADMIN_PASSWORD) return false;
  const userCookies = await cookies();
  userCookies.set("auth_token", "admin", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return true;
}

export async function signOut() {
  const userCookies = await cookies();
  userCookies.delete("auth_token");
}
