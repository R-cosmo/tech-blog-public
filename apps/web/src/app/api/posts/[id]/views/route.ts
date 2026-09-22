import { db } from "@repo/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await db.post.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment views by 1
    const updatedPost = await db.post.update({
      where: { id: parseInt(params.id) },
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
