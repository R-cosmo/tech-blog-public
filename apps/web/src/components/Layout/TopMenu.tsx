"use client";

import Link from "next/link";
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

export function TopMenu({
  query,
  onMenuClick,
}: {
  query?: string;
  onMenuClick?: () => void;
}) {
  const router = useRouter();
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3002";

  const handleSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value.trim();
    router.push(`/search?q=${encodeURIComponent(search)}`);
  });

  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        {/* Sidebar toggle (mobile only) */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
          className="md:hidden rounded-lg border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-100 transition dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          ☰
        </button>

        {/* Home Link */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-slate-900 hover:text-blue-600 transition dark:text-slate-100 dark:hover:text-blue-400"
        >
          <span className="text-xl">←</span>
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Home</span>
        </Link>

        {/* Search Bar */}
        <form action="#" method="GET" className="flex-1 max-w-md">
          <input
            type="search"
            placeholder="Search posts..."
            defaultValue={query ?? ""}
            onChange={handleSearch}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800 dark:focus:ring-blue-900"
          />
        </form>

        {/* Theme Switch */}
        <div className="flex items-center gap-4">
          <ThemeSwitch />
          <Link
            href={adminUrl}
            className="hidden sm:inline px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
