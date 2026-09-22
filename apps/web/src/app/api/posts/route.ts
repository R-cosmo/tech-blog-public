import { db } from "@repo/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const urlId = searchParams.get("urlId");

    // Build where clause for filtering
    const where: any = {
      active: true,
    };

    if (urlId) {
      where.urlId = urlId;
    }

    if (category) {
      where.category = category;
    }

    if (tag) {
      where.tags = {
        contains: tag,
      };
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
      ];
    }

    if (year && month) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const posts = await db.post.findMany({
      where,
      include: {
        Likes: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // If looking for a single post by urlId, return as single object
    if (urlId) {
      if (posts.length === 0) {
        return Response.json({ error: "Post not found" }, { status: 404 });
      }
      const post = posts[0];
      const safePost = post ?? null;
      if (!safePost) {
        return Response.json({ error: "Post not found" }, { status: 404 });
      }
      return Response.json({
        ...safePost,
        likes: safePost.Likes.length,
        Likes: undefined,
      });
    }

    // Transform posts to include like count and remove Likes array
    const transformedPosts = posts.map((post: any) => ({
      ...post,
      likes: post.Likes?.length ?? 0,
      Likes: undefined,
    }));

    return Response.json(transformedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
