import { db } from "@repo/db";
import { isLoggedIn } from "../../../../utils/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isLoggedIn())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    return Response.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return Response.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isLoggedIn())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as {
      title: string;
      description: string;
      content: string;
      category: string;
      tags: string;
      imageUrl: string;
    };

    // Validation
    if (!body.title || !body.description || !body.content) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (body.description.length > 200) {
      return Response.json(
        { error: "Description must be max 200 characters" },
        { status: 400 }
      );
    }

    const post = await db.post.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        category: body.category,
        tags: body.tags,
        imageUrl: body.imageUrl,
      },
    });

    return Response.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return Response.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isLoggedIn())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await db.post.delete({
      where: { id: parseInt(id) },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return Response.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
