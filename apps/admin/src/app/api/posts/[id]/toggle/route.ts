import { db } from "@repo/db";
import { isLoggedIn } from "../../../../../utils/auth";

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
