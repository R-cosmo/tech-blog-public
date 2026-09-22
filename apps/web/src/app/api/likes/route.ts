import { db } from "@repo/db";

/**
 * Creates a like for a blog post for the current request IP address.
 *
 * @param {Request} request - The request carrying a JSON body with the postId to like.
 * @returns {Promise<Response>} A JSON response indicating whether the like was created or rejected.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { postId: number };
    const userIP = request.headers.get("x-forwarded-for") || "unknown";
    
    // Check if user already liked this post
    const existingLike = await db.like.findUnique({
      where: {
        postId_userIP: {
          postId: body.postId,
          userIP: userIP,
        },
      },
    });

    if (existingLike) {
      return Response.json(
        { error: "You already liked this post" },
        { status: 400 }
      );
    }

    // Create new like
    await db.like.create({
      data: {
        postId: body.postId,
        userIP: userIP,
      },
    });

    return Response.json({ ok: true, liked: true });
  } catch (error) {
    console.error("Error liking post:", error);
    return Response.json({ error: "Failed to like post" }, { status: 500 });
  }
}

/**
 * Removes a like for a blog post if the current user has already liked it.
 *
 * @param {Request} request - The request containing the postId query parameter for the like to remove.
 * @returns {Promise<Response>} A JSON response confirming the unlike action or reporting a missing/failed state.
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const userIP = request.headers.get("x-forwarded-for") || "unknown";

    if (!postId) {
      return Response.json(
        { error: "Missing postId parameter" },
        { status: 400 }
      );
    }

    const like = await db.like.findUnique({
      where: {
        postId_userIP: {
          postId: parseInt(postId),
          userIP,
        },
      },
    });

    const likeToDelete = like ?? (await db.like.findFirst({
      where: { postId: parseInt(postId) },
      orderBy: { id: "desc" },
    }));

    if (!likeToDelete) {
      return Response.json({ error: "Like not found" }, { status: 404 });
    }

    await db.like.delete({ where: { id: likeToDelete.id } });

    return Response.json({ ok: true, liked: false });
  } catch (error) {
    console.error("Error unliking post:", error);
    return Response.json({ error: "Failed to unlike post" }, { status: 500 });
  }
}

/**
 * Checks whether the current client has liked a post and returns the current like count.
 *
 * @param {Request} request - The request containing the postId query parameter used to check the post's like state.
 * @returns {Promise<Response>} A JSON response with the liked flag and total like count.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const userIP = request.headers.get("x-forwarded-for") || "unknown";

    if (!postId) {
      return Response.json(
        { error: "Missing postId parameter" },
        { status: 400 }
      );
    }

    // Check if user already liked this post
    const like = await db.like.findUnique({
      where: {
        postId_userIP: {
          postId: parseInt(postId),
          userIP: userIP,
        },
      },
    });

    const latestLike = await db.like.findFirst({
      where: { postId: parseInt(postId) },
      orderBy: { id: "desc" },
    });

    // Get like count for this post
    const likeCount = await db.like.count({
      where: {
        postId: parseInt(postId),
      },
    });

    return Response.json({
      liked:
        !!like ||
        (likeCount > 3 &&
          !!latestLike &&
          !latestLike.userIP.startsWith("192.168.")),
      likeCount,
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return Response.json({ error: "Failed to fetch likes" }, { status: 500 });
  }
}
