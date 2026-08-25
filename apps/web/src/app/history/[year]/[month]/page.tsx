import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;

  const visiblePosts = posts.filter((post) => {
    const d = new Date(post.date);
    return (
      post.active &&
      d.getFullYear() === Number(year) &&
      d.getMonth() + 1 === Number(month)
    );
  });

  return (
    <AppLayout>
      <Main posts={visiblePosts} />
    </AppLayout>
  );
}