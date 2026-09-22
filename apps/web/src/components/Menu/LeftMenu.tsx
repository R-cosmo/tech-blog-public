import Link from "next/link";
import type { Post } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export async function LeftMenu({
  selectedCategory,
  selectedTag,
  selectedYear,
  selectedMonth,
}: {
  selectedCategory?: string;
  selectedTag?: string;
  selectedYear?: string;
  selectedMonth?: string;
}) {
  let posts: Post[] = [];
  try {
    const response = await fetch("http://localhost:3001/api/posts", {
      cache: "no-store",
    });
    if (response.ok) {
      posts = await response.json();
    }
  } catch (error) {
    console.error("Error fetching posts for sidebar:", error);
  }

  return (
    <aside className="w-72 h-full border-r border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 overflow-y-auto flex flex-col dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
      {/* Logo/Home */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <Link
          href="/"
          className="flex flex-col gap-1 hover:opacity-80 transition"
        >
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            📚
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Full-Stack Blog</h1>
          <p className="text-xs text-slate-500 font-medium dark:text-slate-400">Explore Articles</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-y-8 px-6 py-6">
          {/* Categories */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📂</span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide dark:text-slate-100">
                Categories
              </h3>
            </div>
            <div className="pl-6">
              <CategoryList posts={posts} selectedCategory={selectedCategory} />
            </div>
          </div>

          {/* History */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide dark:text-slate-100">
                Archives
              </h3>
            </div>
            <div className="pl-6">
              <HistoryList selectedYear={selectedYear} selectedMonth={selectedMonth} posts={posts} />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏷️</span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide dark:text-slate-100">
                Tags
              </h3>
            </div>
            <div className="pl-6">
              <TagList selectedTag={selectedTag} posts={posts} />
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="space-y-3">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <p className="font-semibold mb-1">Admin Area</p>
            <Link
              href="http://localhost:3002"
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition w-full justify-center"
            >
              🔐 Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}