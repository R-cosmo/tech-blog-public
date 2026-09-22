import { AppLayout } from "@/components/Layout/AppLayout";
import { LikeButton } from "@/components/Blog/LikeButton";
import { marked } from "marked";
import Link from "next/link";

type Post = {
  id: number;
  urlId: string;
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
  date: Date;
  views: number;
  likes: number;
  active: boolean;
};

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  try {
    const response = await fetch(
      `http://localhost:3001/api/posts?urlId=${encodeURIComponent(urlId)}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return <AppLayout>Article not found</AppLayout>;
    }

    const post: Post = await response.json();

    // Increment views
    try {
      await fetch(`http://localhost:3001/api/posts/${post.id}/views`, {
        method: "PATCH",
      });
      post.views += 1;
    } catch (error) {
      console.error("Error incrementing views:", error);
    }

    const tagList = post.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const htmlContent = await marked.parse(post.content);

    return (
      <AppLayout>
        <article
          data-test-id={`blog-post-${post.id}`}
          className="flex flex-col gap-4 py-10"
        >
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="rounded-lg max-h-96 w-full object-cover"
            />
          )}

          <Link
            href={`/post/${post.urlId}`}
            className="text-4xl font-bold text-slate-900 hover:underline dark:text-slate-100"
          >
            {post.title}
          </Link>

          <p className="text-sm text-slate-600 dark:text-slate-400">{post.category}</p>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span>{tagList.map((tag) => `#${tag}`).join(" ")}</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <span>{post.views} views</span>
            <LikeButton postId={post.id} initialCount={post.likes} />
          </div>

          <div
            data-test-id="content-markdown"
            className="prose prose-lg dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </AppLayout>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    return <AppLayout>Error loading article</AppLayout>;
  }
}
