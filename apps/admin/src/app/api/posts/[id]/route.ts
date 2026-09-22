import { db } from "@repo/db";
import { isLoggedIn } from "../../../../utils/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Fetches one post by its id for the admin editor.
 *
 * @param {Request} request - The incoming HTTP request for the single-post lookup.
 * @param {{ params: Promise<{ id: string }> }} context - Route parameters containing the post id.
 * @returns {Promise<Response>} A JSON response with the requested post or a not-found/error result.
 */
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

/**
 * Updates an existing post using the submitted admin form data.
 *
 * @param {Request} request - The request carrying the JSON body with updated post values.
 * @param {{ params: Promise<{ id: string }> }} context - Route parameters containing the post id to update.
 * @returns {Promise<Response>} A JSON response with the updated post or a validation/error result.
 */
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

/**
 * Deletes a single post by id after confirming the user is authenticated.
 *
 * @param {Request} request - The incoming request used to trigger the delete action.
 * @param {{ params: Promise<{ id: string }> }} context - Route parameters containing the post id to delete.
 * @returns {Promise<Response>} A JSON response confirming the deletion or returning an error.
 */
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
