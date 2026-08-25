import type { Post } from "@repo/db/data";
import { marked } from "marked";

export async function BlogDetail({ post }: { post: Post }) {
  const content = await marked.parse(post.content);

  return (
    <article data-test-id={`blog-post-${post.id}`} className="prose mx-auto max-w-4xl py-10">
      <h1 className="mb-4 text-4xl font-bold text-slate-900">{post.title}</h1>

      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className="mb-6 rounded-lg" />
      )}

      <div className="mb-6 space-y-1 text-sm text-slate-500">
        <p>Category: {post.category}</p>
        <p>Tags: {post.tags.split(",").map((tag) => tag.trim()).join(", ")}</p>
        <p>
          Date: {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </p>
        <p>Likes: {post.likes}</p>
        <p>Views: {post.views}</p>
      </div>

      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
