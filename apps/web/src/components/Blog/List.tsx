import type { Post } from "@repo/db/data";
import Link from "next/link";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return <div className="py-6 text-lg font-semibold text-slate-700">0 Posts</div>;
  }

  return (
    <div className="flex flex-col gap-8 py-6">
      {posts.map((post) => (
        <BlogListItem key={post.id} post={post} />
      ))}
    </div>
  );
}

export default BlogList;
