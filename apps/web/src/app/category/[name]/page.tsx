import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getBaseUrl } from "@/utils/base-url";
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

/**
 * Displays posts for a selected category from the route URL.
 *
 * @param {{ params: Promise<{ name: string }> }} props - Route parameters containing the category name.
 * @returns {Promise<JSX.Element>} The category page with matching posts or an empty post list on failure.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  try {
    const response = await fetch(`${getBaseUrl()}/api/posts`, {
      cache: "no-store",
    });

    let visiblePosts: Post[] = [];
    if (response.ok) {
      const posts: Post[] = await response.json();
      visiblePosts = posts.filter((post) => toUrlPath(post.category) === name);
    }

    return (
      <AppLayout selectedCategory={name}>
        <Main posts={visiblePosts} />
      </AppLayout>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <AppLayout selectedCategory={name}>
        <Main posts={[]} />
      </AppLayout>
    );
  }
}
