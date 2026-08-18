import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  // Tags are comma-separated strings, then convert to array
  const filtered = posts.filter((p) => {
    if (!p.active) return false;
    const tagList = p.tags.split(",").map((t) => t.trim().toLowerCase());
    return tagList.includes(tag.toLowerCase());
  });

  return (
    <AppLayout>
      <Main posts={filtered} />
    </AppLayout>
  );
}
