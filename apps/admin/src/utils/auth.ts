import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const ADMIN_PASSWORD = "123";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function isLoggedIn() {
  const userCookies = await cookies();
  const token = userCookies.get("auth_token")?.value;

  if (!token) {
    return false;
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

export async function signIn(password: string) {
  if (password !== ADMIN_PASSWORD) return false;
  const userCookies = await cookies();
  
  // Create JWT token
  const token = jwt.sign({ admin: true }, JWT_SECRET, {
    expiresIn: "7d",
  });

  userCookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
  return true;
}

export async function signOut() {
  const userCookies = await cookies();
  userCookies.delete("auth_token");
}
