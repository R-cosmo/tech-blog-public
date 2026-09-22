"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb() {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (pathname === "/") {
      return [{ label: "Home", href: "/" }];
    }

    const parts = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

    let currentPath = "";
    for (let i = 0; i < parts.length; i++) {
      currentPath += `/${parts[i]}`;
      const isLast = i === parts.length - 1;

      // Format labels
      const segment = parts[i] ?? "";
      let label = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // Special cases
      if (parts[i] === "search" && i < parts.length - 1) continue;
      if (parts[i] === "posts" && parts[i - 1] === "admin") {
        label = "Posts";
      }

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumb on home page
  }

  return (
    <nav className="mb-4 flex items-center gap-2 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center gap-2">
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-slate-600 dark:text-slate-400">{crumb.label}</span>
          )}
          {index < breadcrumbs.length - 1 && (
            <span className="text-slate-400 dark:text-slate-600">/</span>
          )}
        </div>
      ))}
    </nav>
  );
}
