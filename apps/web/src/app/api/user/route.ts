import { cookies } from "next/headers";
import { createUserToken, verifyUserToken, type UserRole } from "@/utils/user-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const username = body.username?.trim();
    const password = body.password?.trim();

    if (!username || !password) {
      return Response.json({ error: "Username and password are required" }, { status: 400 });
    }

    const allowedUsers: Record<string, string> = {
      alice: "password123",
      bob: "password123",
      demo: "password123",
    };

    const role: UserRole = allowedUsers[username] === password ? "user" : "user";
    if (allowedUsers[username] !== password) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createUserToken(username, role);
    const userCookies = await cookies();

    userCookies.set("user_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return Response.json({ ok: true, role, username });
  } catch {
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const userCookies = await cookies();
  userCookies.delete("user_token");
  return Response.json({ ok: true });
}

export async function GET() {
  const userCookies = await cookies();
  const token = userCookies.get("user_token")?.value;

  if (!token) {
    return Response.json({ user: null });
  }

  const payload = verifyUserToken(token);

  if (!payload) {
    return Response.json({ user: null });
  }

  return Response.json({ user: { username: payload.username, role: payload.role } });
}
