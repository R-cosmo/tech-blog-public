import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const term = q.toLowerCase();

  const visiblePosts = posts.filter((post) => {
    if (!post.active) return false;
    return (
      post.title.toLowerCase().includes(term) ||
      post.description.toLowerCase().includes(term)
    );
  });

  return (
    <AppLayout query={q}>
      <Main posts={visiblePosts} />
    </AppLayout>
  );
}
