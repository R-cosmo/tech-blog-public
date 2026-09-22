import type { PropsWithChildren } from "react";
import { Breadcrumb } from "../Breadcrumb";
import { LeftMenu } from "../Menu/LeftMenu";
import { Shell } from "./Shell";

export async function AppLayout({
  children,
  query,
  selectedCategory,
  selectedTag,
  selectedYear,
  selectedMonth,
}: PropsWithChildren<{
  query?: string;
  selectedCategory?: string;
  selectedTag?: string;
  selectedYear?: string;
  selectedMonth?: string;
}>) {
  return (
    <Shell
      query={query}
      sidebar={
        <LeftMenu
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      }
    >
      <div className="px-6 py-4">
        <Breadcrumb />
      </div>
      {children}
    </Shell>
  );
}
