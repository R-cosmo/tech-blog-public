import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu() {
  return (
    <div>
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div>Top Links and blog name</div>
      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <CategoryList posts={posts} />
          </li>
          <li>
            <HistoryList selectedYear="" selectedMonth="" posts={posts} />
          </li>
          <li>
            <TagList selectedTag="" posts={posts} />
          </li>
          <li>Admin</li>
        </ul>
      </nav>
    </div>
  );
}
