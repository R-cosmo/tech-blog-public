import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu() {
  return (
    <div>
      <div>Top Links and blog name</div>
      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <CategoryList posts={posts} />
          <HistoryList selectedYear="" selectedMonth="" posts={posts} />
          <TagList selectedTag="" posts={posts} />
          <li>Admin</li>
        </ul>
      </nav>
    </div>
  );
}