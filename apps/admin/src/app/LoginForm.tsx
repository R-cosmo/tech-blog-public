"use client";

import { useState } from "react";
import Link from "next/link";

export function LoginForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const password = new FormData(event.currentTarget).get("password") as string;
    
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Blog Admin</h1>
          <p className="text-slate-600">Manage your blog posts</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-900">Authentication Failed</h3>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">
                Admin Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                autoComplete="off"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Demo Password:</span> <code className="bg-blue-100 px-2 py-1 rounded">123</code>
            </p>
          </div>

          {/* Back to Website */}
          <div className="text-center">
            <Link
              href="http://localhost:3001"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition"
            >
              ← Back to Website
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          This is a secure admin area. Only authorized users can access.
        </p>
      </div>
    </div>
  );
}