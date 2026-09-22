import { createHmac, timingSafeEqual } from "node:crypto";

export type UserRole = "user" | "admin" | "editor";

const JWT_SECRET = process.env.JWT_SECRET || "blog-user-secret";

function encode(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

export function isValidUserRole(role: string): role is UserRole {
  return role === "user" || role === "admin" || role === "editor";
}

export function createUserToken(username: string, role: UserRole): string {
  const header = encode({ alg: "HS256", typ: "JWT" });
  const payload = encode({ username, role, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 });
  const unsignedToken = `${header}.${payload}`;
  const signature = createHmac("sha256", JWT_SECRET).update(unsignedToken).digest("base64url");
  return `${unsignedToken}.${signature}`;
}

export function verifyUserToken(token: string): { username: string; role: UserRole; exp: number } | null {
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return null;

    const unsignedToken = `${header}.${payload}`;
    const expectedSignature = Buffer.from(
      createHmac("sha256", JWT_SECRET).update(unsignedToken).digest("base64url"),
    );
    const actualSignature = Buffer.from(signature);

    if (
      expectedSignature.length !== actualSignature.length ||
      !timingSafeEqual(expectedSignature, actualSignature)
    ) {
      return null;
    }

    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      username?: string;
      role?: string;
      exp?: number;
    };

    if (!claims.username || !claims.role || !isValidUserRole(claims.role)) {
      return null;
    }

    if (!claims.exp || claims.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return { username: claims.username, role: claims.role, exp: claims.exp };
  } catch {
    return null;
  }
}
