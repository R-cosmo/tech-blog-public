import type { Post } from "@repo/db/data";

export function BlogListItem({ post }: { post: Post }) {
  return (
    <article
      key={post.id}
      className="flex flex-row gap-8"
      data-test-id={`blog-post-${post.id}`}
    >
      List Item
    </article>
  );
}
