import { signIn, signOut } from "../../../utils/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  if (!(await signIn(body.password ?? ""))) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }
  return Response.json({ ok: true });
}

export async function DELETE() {
  await signOut();
  return Response.json({ ok: true });
}