import { db } from "@repo/db";

/**
 * Returns a single published post by id for the public blog.
 *
 * @param {Request} request - The incoming request for the article lookup.
 * @param {{ params: Promise<{ id: string }> }} context - Route parameters containing the post id.
 * @returns {Promise<Response>} A JSON response containing the post data or a not-found/error message.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await db.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        Likes: true,
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    // Only return active posts to public
    if (!post.active) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const likeCount = post.Likes.length;

    return Response.json({
      ...post,
      likes: likeCount,
      Likes: undefined, // Don't return the array in public API
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return Response.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
