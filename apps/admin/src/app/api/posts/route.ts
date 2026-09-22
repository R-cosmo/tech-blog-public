import { db } from "@repo/db";
import { isLoggedIn } from "../../../utils/auth";

/**
 * Returns all posts for the admin dashboard, including like metadata.
 *
 * @param {Request} request - The incoming request object for the posts listing endpoint.
 * @returns {Promise<Response>} A JSON response containing the list of posts or an authorization/error result.
 */
export async function GET(request: Request) {
  if (!(await isLoggedIn())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await db.post.findMany({
      include: {
        Likes: true,
      },
    });

    return Response.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

/**
 * Creates a new blog post from the supplied admin form data.
 *
 * @param {Request} request - The request carrying the JSON body with the post fields.
 * @returns {Promise<Response>} A JSON response containing the created post or a validation error.
 */
export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    // Generate urlId from title
    const urlId = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const post = await db.post.create({
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        category: body.category || "Uncategorized",
        tags: body.tags || "",
        imageUrl: body.imageUrl || "",
        urlId: urlId,
        active: true,
      },
    });

    return Response.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return Response.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
