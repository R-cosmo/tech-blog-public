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
 * Displays all posts associated with a selected tag from the route URL.
 *
 * @param {{ params: Promise<{ tag: string }> }} props - Route parameters containing the tag name.
 * @returns {Promise<JSX.Element>} The tag page with matching posts or an empty post list on failure.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  try {
    const response = await fetch(`${getBaseUrl()}/api/posts`, {
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
