import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_PASSWORD, EDITOR_PASSWORD, type UserRole } from "./auth-constants";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

function encode(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function signToken(role: UserRole): string {
  const header = encode({ alg: "HS256", typ: "JWT" });
  const payload = encode({ role, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 });
  const unsignedToken = `${header}.${payload}`;
  const signature = createHmac("sha256", JWT_SECRET).update(unsignedToken).digest("base64url");
  return `${unsignedToken}.${signature}`;
}

function verifyToken(token: string): { role?: UserRole; exp?: number } {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) throw new Error("Invalid token");

  const unsignedToken = `${header}.${payload}`;
  const expectedSignature = Buffer.from(
    createHmac("sha256", JWT_SECRET).update(unsignedToken).digest("base64url")
  );
  const actualSignature = Buffer.from(signature);
  if (
    expectedSignature.length !== actualSignature.length ||
    !timingSafeEqual(expectedSignature, actualSignature)
  ) {
    throw new Error("Invalid token");
  }

  const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
    role?: UserRole;
    exp?: number;
  };
  if (!claims.exp || claims.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error("Expired token");
  }
  return claims;
}

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const userCookies = await cookies();
  const token = userCookies.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = verifyToken(token);
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

  const token = signToken(role);

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
