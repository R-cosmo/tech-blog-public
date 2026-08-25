// import { posts, type Post } from "../components/data";

export async function tags(posts: { tags: string; active: boolean }[]) {
  const allTags = posts
    .filter((post) => post.active)
    .flatMap((post) =>
      post.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    );

  const unique = [...new Set(allTags)];

  return unique.map((name) => ({
    name,
    count: allTags.filter((tag) => tag === name).length,
  }));// TODO: Implement per specification
}
