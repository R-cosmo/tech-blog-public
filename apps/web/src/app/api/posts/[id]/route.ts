import { db } from "@repo/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await db.post.findUnique({
      where: { id: parseInt(params.id) },
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
