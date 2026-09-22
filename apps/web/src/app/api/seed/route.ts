import { seed } from "@repo/db/seed";
import { NextResponse } from "next/server";

/**
 * Seeds the local database when the E2E environment flag is enabled.
 *
 * @returns {Promise<Response>} A JSON response confirming the seed run or a 501 status when the environment is not enabled.
 */
export async function GET() {
  if (!process.env.E2E) {
    return new Response("Not Available", { status: 501 });
  }

  await seed();
  return NextResponse.json({ message: "Seeded" }, { status: 200 });
}
