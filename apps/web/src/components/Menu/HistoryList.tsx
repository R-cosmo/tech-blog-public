import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { SummaryItem } from "./SummaryItem";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  const historyItems = history(posts);

  // TODO: use the "history" function on "functions" directory to get the history
  //       and render all history items using the SummaryItem component
  return  (
    <div className="flex flex-col gap-2">
      {historyItems.map((item) => {
        return (
          <SummaryItem
            key={`${item.year}-${item.month}`}
            name={`${months[item.month]} ${item.year}`}
            count={item.count}
            link={`/history/${item.year}/${item.month}`}
            isSelected={false}
          />
        );
      })} 
    </div>
  );
}
