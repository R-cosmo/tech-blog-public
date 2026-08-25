import { type Post } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";
import { toUrlPath } from "@repo/utils/url";

export async function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  const postTags = await tags(posts);


 return (
    <LinkList title="Tags">
      {postTags.map((tagItem) => (
        <SummaryItem
          key={tagItem.name}
          name={`#${tagItem.name}`}
          link={`/tags/${toUrlPath(tagItem.name)}`}
          count={tagItem.count}
          isSelected={selectedTag === tagItem.name}
        />
      ))}
    </LinkList>
  );
}
