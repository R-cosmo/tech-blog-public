import { signIn, signOut } from "../../../utils/auth";

/**
 * Validates the submitted admin password and signs the user in.
 *
 * @param {Request} request - The incoming HTTP request containing a JSON body with the password field.
 * @returns {Promise<Response>} A JSON response indicating success or an authentication error.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  const role = await signIn(body.password ?? "");

  if (!role) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  return Response.json({ ok: true, role });
}

/**
 * Signs the current admin user out of the session.
 *
 * @returns {Promise<Response>} A JSON response confirming the logout action completed.
 */
export async function DELETE() {
  await signOut();
  return Response.json({ ok: true });
}