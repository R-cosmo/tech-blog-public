import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

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
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  try {
    const response = await fetch(
      `http://localhost:3001/api/posts?search=${encodeURIComponent(q)}`,
      { cache: "no-store" }
    );

    let visiblePosts: Post[] = [];
    if (response.ok) {
      visiblePosts = await response.json();
    }

    return (
      <AppLayout query={q}>
        <Main posts={visiblePosts} />
      </AppLayout>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <AppLayout query={q}>
        <Main posts={[]} />
      </AppLayout>
    );
  }
}
