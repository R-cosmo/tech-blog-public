import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ADMIN_PASSWORD, EDITOR_PASSWORD, type UserRole } from "./auth-constants";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const userCookies = await cookies();
  const token = userCookies.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role?: UserRole };
    if (payload.role === "admin" || payload.role === "editor") {
      return payload.role;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function isLoggedIn(requiredRole?: UserRole) {
  const role = await getCurrentUserRole();

  if (!role) {
    return false;
  }

  if (requiredRole) {
    return role === requiredRole;
  }

  return true;
}

export async function signIn(password: string): Promise<UserRole | false> {
  const role = password === ADMIN_PASSWORD ? "admin" : password === EDITOR_PASSWORD ? "editor" : null;

  if (!role) return false;

  const userCookies = await cookies();

  const token = jwt.sign({ role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  userCookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return role;
}

export async function signOut() {
  const userCookies = await cookies();
  userCookies.delete("auth_token");
}
