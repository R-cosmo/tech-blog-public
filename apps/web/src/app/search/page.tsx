import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams.q || "").toLowerCase();

  // If no query, show nothing
  if (!query) {
    return (
      <AppLayout>
        <Main posts={[]} />
      </AppLayout>
    );
  }

  // Filter posts by title, description, or tags
  const filtered = posts.filter((p) => {
    if (!p.active) return false;

    const title = p.title.toLowerCase();
    const description = p.description.toLowerCase();
    const tagList = p.tags.split(",").map((t) => t.trim().toLowerCase());

    return (
      title.includes(query) ||
      description.includes(query) ||
      tagList.some((t) => t.includes(query))
    );
  });

  return (
    <AppLayout>
      <Main posts={filtered} />
    </AppLayout>
  );
}

