"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.reload();
  }

  const navItems = [
    { label: "Dashboard", href: "/", icon: "📊" },
    { label: "Create Post", href: "/posts/create", icon: "✏️" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white shadow-lg">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold">Blog Admin</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your posts</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.href)
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 w-64">
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              {pathname === "/" ? "Dashboard" : "Post Management"}
            </h2>
            <Link
              href="http://localhost:3001"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition"
            >
              <span>👁️</span>
              View Website
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
