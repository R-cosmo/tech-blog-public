import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  // Filter posts by category (case-insensitive)
  const filtered = posts.filter(
    (p) => p.active && p.category.toLowerCase() === name.toLowerCase()
  );

  return (
    <AppLayout>
      <Main posts={filtered} />
    </AppLayout>
  );
}
