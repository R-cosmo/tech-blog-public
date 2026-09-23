import { db } from "@repo/db";

/**
 * Returns all comments for a post, ordered oldest-first, for building a nested reply tree client-side.
 *
 * @param {Request} request - The incoming request containing a `postId` query parameter.
 * @returns {Promise<Response>} A JSON list of comments for the requested post.
 */
export async function GET(request: Request) {
  try {
    // Read the post ID from the URL, for example: /api/comments?postId=1.
    const { searchParams } = new URL(request.url);
    const postId = Number(searchParams.get("postId"));

    // A missing or invalid post ID cannot be used to find comments.
    if (!postId) {
      return Response.json({ error: "postId is required" }, { status: 400 });
    }

    const comments = await db.comment.findMany({
      where: { postId },
      // Oldest-first ordering keeps the conversation chronological.
      orderBy: { createdAt: "asc" },
    });

    return Response.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return Response.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

/**
 * Creates a new comment or nested reply on a post.
 *
 * @param {Request} request - The request carrying a JSON body with postId, author, content and an optional parentId for replies.
 * @returns {Promise<Response>} A JSON response with the created comment, or a validation/server error.
 */
export async function POST(request: Request) {
  try {
    // Parse the JSON body sent by CommentSection when a comment is submitted.
    const body = (await request.json()) as {
      postId: number;
      author: string;
      content: string;
      parentId?: string;
    };

    // Trim whitespace so comments containing only spaces are rejected.
    const author = body.author?.trim();
    const content = body.content?.trim();

    // Return 400 because the client sent incomplete or invalid input.
    if (!body.postId || !author || !content) {
      return Response.json(
        { error: "postId, author and content are required" },
        { status: 400 }
      );
    }

    const comment = await db.comment.create({
      data: {
        postId: body.postId,
        author,
        content,
        // null creates a top-level comment; an ID creates a nested reply.
        parentId: body.parentId || null,
      },
    });

    // 201 means that a new comment was successfully created.
    return Response.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return Response.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
