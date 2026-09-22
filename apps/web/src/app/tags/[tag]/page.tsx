import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { toUrlPath } from "@repo/utils/url";

type Post = {
  id: number;
  urlId: string;
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
  date: Date;
  views: number;
  likes: number;
  active: boolean;
};

export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  try {
    const response = await fetch(`http://localhost:3001/api/posts`, {
      cache: "no-store",
    });

    let filtered: Post[] = [];
    if (response.ok) {
      const posts: Post[] = await response.json();
      filtered = posts.filter((post) =>
        post.tags
          .split(",")
          .map((t) => toUrlPath(t.trim()))
          .includes(tag),
      );
    }

    return (
      <AppLayout selectedTag={tag}>
        <Main posts={filtered} />
      </AppLayout>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <AppLayout selectedTag={tag}>
        <Main posts={[]} />
      </AppLayout>
    );
  }
}
