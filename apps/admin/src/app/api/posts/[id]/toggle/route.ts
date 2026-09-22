import { db } from "@repo/db";
import { isLoggedIn } from "../../../../../utils/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Toggles the active status of a post for the admin dashboard.
 *
 * @param {Request} request - The incoming request used to trigger the status toggle.
 * @param {{ params: Promise<{ id: string }> }} context - Route parameters containing the post id to toggle.
 * @returns {Promise<Response>} A JSON response with the updated post or an error result.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isLoggedIn())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    // Get current active state
    const post = await db.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    // Toggle active status
    const updatedPost = await db.post.update({
      where: { id: parseInt(id) },
      data: {
        active: !post.active,
      },
    });

    return Response.json(updatedPost);
  } catch (error) {
    console.error("Error toggling post status:", error);
    return Response.json(
      { error: "Failed to toggle post status" },
      { status: 500 }
    );
  }
}
