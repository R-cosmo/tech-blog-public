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
 * Shows blog posts for a selected month and year from the route URL.
 *
 * @param {{ params: Promise<{ year: string; month: string }> }} props - Route parameters containing the year and month to filter posts by.
 * @returns {Promise<JSX.Element>} The archive page with matching posts or an empty list on failure.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;

  try {
    const response = await fetch(
      `${getBaseUrl()}/api/posts?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`,
      { cache: "no-store" }
    );

    let visiblePosts: Post[] = [];
    if (response.ok) {
      visiblePosts = await response.json();
    }

    return (
      <AppLayout selectedYear={year} selectedMonth={month}>
        <Main posts={visiblePosts} />
      </AppLayout>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <AppLayout selectedYear={year} selectedMonth={month}>
        <Main posts={[]} />
      </AppLayout>
    );
  }
}