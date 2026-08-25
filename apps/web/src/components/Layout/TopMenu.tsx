"use client";

import { useRouter } from "next/navigation";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function TopMenu({ query }: { query?: string }) {
  const router = useRouter();

  const handleSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value.trim();
    router.push(`/search?q=${encodeURIComponent(search)}`);
  });

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white p-4">
      <form action="#" method="GET" className="grid flex-1 grid-cols-1">
        <input
          type="search"
          placeholder="Search"
          defaultValue={query ?? ""}
          onChange={handleSearch}
          className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-500"
        />
      </form>

      <div className="flex items-center gap-x-6">
        <ThemeSwitch />
      </div>
    </div>
  );
}
