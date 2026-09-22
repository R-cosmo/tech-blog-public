import type { Post } from "@repo/db/data";
import BlogList from "./Blog/List";

export function Main({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  return (
    <main className={className}>
      <section className="animate-hero-in relative overflow-hidden rounded-2xl bg-gradient-to-br from-wsu via-wsu-light to-slate-900 px-8 py-16 text-center shadow-lg">
        <div className="animate-hero-glow absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
        <h1 className="animate-hero-text relative text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Welcome to the Blog
        </h1>
        <p className="animate-hero-text relative mt-4 text-lg text-slate-100/90" style={{ animationDelay: "150ms" }}>
          Fresh stories, ideas, and updates delivered one post at a time.
        </p>
      </section>
      <BlogList posts={posts} />
    </main>
  );
}
