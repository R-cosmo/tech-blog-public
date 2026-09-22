import type { Post } from "@repo/db/data";
import Link from "next/link";

export function BlogListItem({ post, index = 0 }: { post: Post; index?: number }) {
  const tags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <article
      key={post.id}
      className="animate-blog-fade flex flex-row gap-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500"
      style={{ animationDelay: `${index * 90}ms` }}
      data-test-id={`blog-post-${post.id}`}
    >
      <div className="w-40 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-28 w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <Link href={`/post/${post.urlId}`} className="text-xl font-bold text-slate-900 transition-colors duration-200 hover:text-blue-600 hover:underline dark:text-slate-100 dark:hover:text-blue-400">
          {post.title}
        </Link>

        <p className="text-sm text-slate-600 dark:text-slate-400">{post.description}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{post.category}</p>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>{new Date(post.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
          <span>{tags.map((tag) => `#${tag}`).join(" ")}</span>
        </div>

        <div className="mt-1 flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
          <span>{post.views} views</span>
          <span>{post.likes} likes</span>
        </div>
      </div>
    </article>
  );
}
