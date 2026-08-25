import { posts } from "@repo/db/data";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const visiblePosts = posts.filter(
    (post) =>
      post.active &&
      toUrlPath(post.category) === name,
  );

  return (
    <AppLayout>
      <Main posts={visiblePosts} />
    </AppLayout>
  );
}
