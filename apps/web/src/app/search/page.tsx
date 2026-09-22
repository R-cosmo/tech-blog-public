import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getBaseUrl } from "@/utils/base-url";

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

/**
 * Searches blog posts using the query string from the page URL.
 *
 * @param {{ searchParams: Promise<{ q?: string }> }} props - Search parameters containing the user query string.
 * @returns {Promise<JSX.Element>} The search results page with matching posts or an empty list if no results are found.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  try {
    const response = await fetch(
      `${getBaseUrl()}/api/posts?search=${encodeURIComponent(q)}`,
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
