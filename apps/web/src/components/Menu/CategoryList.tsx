import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";

export function CategoryList({
  posts,
  selectedCategory,
}: {
  posts: Post[];
  selectedCategory?: string;
}) {
  const categoryItems = [
    ...categories(posts),
    ...["Mongo", "DevOps"]
      .filter((name) => !categories(posts).some((item) => item.name === name))
      .map((name) => ({ name, count: 0 })),
  ];

  return (
    <ul className="space-y-1">
      {categoryItems.map((item) => (
        <SummaryItem
          key={item.name}
          count={item.count}
          name={item.name}
          isSelected={toUrlPath(item.name) === selectedCategory}
          link={`/category/${toUrlPath(item.name)}`}
          title={`Category / ${item.name}`}
        />
      ))}
    </ul>
  );
}
