"use client";

import { useState, type PropsWithChildren, type ReactNode } from "react";
import { TopMenu } from "./TopMenu";

export function Shell({
  children,
  sidebar,
  query,
}: PropsWithChildren<{ sidebar: ReactNode; query?: string }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay, closes the sidebar when tapped */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 h-screen transform transition-transform duration-200 ease-in-out md:sticky md:top-0 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopMenu query={query} onMenuClick={() => setSidebarOpen((open) => !open)} />
        {children}
      </div>
    </div>
  );
}
