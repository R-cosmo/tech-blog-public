"use client";

import type { Post } from "@repo/db/data";
import { useEffect, useRef, useState } from "react";
import { BlogListItem } from "./ListItem";

const PAGE_SIZE = 5;

export function BlogList({ posts }: { posts: Post[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset pagination whenever the underlying post list changes (e.g. new filter/search)
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [posts]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((count) => Math.min(count + PAGE_SIZE, posts.length));
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [posts.length]);

  if (!posts.length) {
    return <div className="py-6 text-lg font-semibold text-slate-700 dark:text-slate-300">0 Posts</div>;
  }

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <div className="flex flex-col gap-8 py-6">
      {visiblePosts.map((post, index) => (
        <BlogListItem key={post.id} post={post} index={index} />
      ))}

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          <button
            type="button"
            data-test-id="load-more-button"
            onClick={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, posts.length))}
            className="rounded-full bg-slate-100 px-6 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Load more posts
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogList;

