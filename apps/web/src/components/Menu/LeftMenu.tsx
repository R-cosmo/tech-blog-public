import Link from "next/link";
import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu() {
  return (
    <aside className="w-72 border-r border-slate-200 bg-slate-50 p-6">
      <div className="mb-6">
        <Link href="/" className="text-2xl font-bold text-slate-900">
          Full-Stack Blog
        </Link>
      </div>

      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <CategoryList posts={posts} />
          <HistoryList selectedYear="" selectedMonth="" posts={posts} />
          <TagList selectedTag="" posts={posts} />
          <li className="mt-2 text-sm font-medium text-slate-500">Admin</li>
        </ul>
      </nav>
    </aside>
  );
}