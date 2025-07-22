import type { Post } from "@repo/db/data";

export function BlogList({ posts }: { posts: Post[] }) {
  return <div className="py-6">List</div>;
}

export default BlogList;
