import { db } from "@repo/db";

/**
 * Increments the view count for a specific public post.
 *
 * @param {Request} request - The incoming request that triggers the view update.
 * @param {{ params: Promise<{ id: string }> }} context - Route parameters containing the post id whose views should increase.
 * @returns {Promise<Response>} A JSON response with the updated post record or an error result.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await db.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment views by 1
    const updatedPost = await db.post.update({
      where: { id: parseInt(id) },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return Response.json(updatedPost);
  } catch (error) {
    console.error("Error incrementing views:", error);
    return Response.json(
      { error: "Failed to increment views" },
      { status: 500 }
    );
  }
}
