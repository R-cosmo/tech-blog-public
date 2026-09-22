import Link from "next/link";

export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  const label = name;
  const itemTitle = title ?? name;

  return (
    <li className="list-none">
      <Link
        href={link}
        title={itemTitle}
        className={
          isSelected
            ? "selected flex items-center justify-between rounded bg-blue-100 px-2 py-1 font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
            : "flex items-center justify-between rounded px-2 py-1 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        }
      >
        <span>{label}</span>
        <span data-test-id="post-count" className="ml-2 text-sm font-medium">
          {count}
        </span>
      </Link>
    </li>
  );
}
