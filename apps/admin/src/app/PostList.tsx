"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Post = {
  id: number;
  urlId: string;
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
  date: Date;
  views: number;
  active: boolean;
};

function escapeCsvValue(value: string | number | boolean) {
  const stringValue = String(value);
  return /[",\n\r]/.test(stringValue)
    ? `"${stringValue.replace(/"/g, '""')}"`
    : stringValue;
}

function createPostsCsv(posts: Post[]) {
  const headers = [
    "id",
    "urlId",
    "title",
    "category",
    "description",
    "content",
    "imageUrl",
    "tags",
    "date",
    "views",
    "active",
  ];
  const rows = posts.map((post) => [
    post.id,
    post.urlId,
    post.title,
    post.category,
    post.description,
    post.content,
    post.imageUrl,
    post.tags,
    post.date.toISOString(),
    post.views,
    post.active,
  ]);

  return [headers, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
}

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState("date-desc");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts");
        if (response.ok) {
          const data = await response.json();
          const transformedData = data.map((post: any) => ({
            ...post,
            date: new Date(post.date),
          }));
          setPosts(transformedData);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => posts.filter((post) => {
    const searchable = `${post.title} ${post.content}`.toLowerCase();
    const dateDigits = date.replace(/\D/g, "");
    let isAfterDate = true;
    if (dateDigits.length >= 8) {
      const month = parseInt(dateDigits.slice(0, 2), 10) - 1;
      const day = parseInt(dateDigits.slice(2, 4), 10);
      const year = parseInt(dateDigits.slice(4, 8), 10);
      const filterDate = new Date(year, month, day);
      isAfterDate = !Number.isNaN(filterDate.getTime()) && post.date.getTime() >= filterDate.getTime();
    }
    return searchable.includes(content.toLowerCase()) && post.tags.toLowerCase().includes(tag.toLowerCase()) && isAfterDate;
  }).sort((left, right) => {
    if (sort.startsWith("title")) {
      const comparison = left.title.localeCompare(right.title);
      return sort === "title-asc" ? comparison : -comparison;
    }
    const comparison = left.date.getTime() - right.date.getTime();
    return sort === "date-asc" ? comparison : -comparison;
  }), [posts, content, date, sort, tag]);

  async function togglePostStatus(postId: number) {
    try {
      const response = await fetch(`/api/posts/${postId}/toggle`, {
        method: "PATCH",
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts((current) =>
          current.map((post) =>
            post.id === postId ? { ...post, active: updatedPost.active } : post
          )
        );
      }
    } catch (error) {
      console.error("Error toggling post status:", error);
    }
  }

  async function bulkSetStatus(nextActive: boolean) {
    if (selectedIds.length === 0) {
      return;
    }

    try {
      const results = await Promise.all(
        selectedIds.map(async (postId) => {
          const response = await fetch(`/api/posts/${postId}/toggle`, {
            method: "PATCH",
          });

          if (!response.ok) {
            throw new Error(`Failed to update post ${postId}`);
          }

          return response.json();
        })
      );

      setPosts((current) =>
        current.map((post) => {
          const match = results.find((updatedPost) => updatedPost.id === post.id);
          return match ? { ...post, active: match.active } : post;
        })
      );
      setSelectedIds([]);
    } catch (error) {
      console.error("Error updating selected posts:", error);
      alert("Unable to update the selected posts. Please try again.");
    }
  }

  async function bulkDeleteSelected() {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected post(s)? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await Promise.all(
        selectedIds.map(async (postId) => {
          const response = await fetch(`/api/posts/${postId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error(`Failed to delete post ${postId}`);
          }
        })
      );

      setPosts((current) => current.filter((post) => !selectedIds.includes(post.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error("Error deleting selected posts:", error);
      alert("Unable to delete the selected posts. Please try again.");
    }
  }

  async function deletePost(postId: number, title: string) {
    const confirmed = window.confirm(`Delete "${title}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete post");
      }

      setPosts((current) => current.filter((post) => post.id !== postId));
      setSelectedIds((current) => current.filter((id) => id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Unable to delete this post. Please try again.");
    }
  }

  const selectAllVisible = () => {
    const visibleIds = filteredPosts.map((post) => post.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((current) => current.filter((id) => !visibleIds.includes(id)));
      return;
    }

    setSelectedIds((current) => Array.from(new Set([...current, ...visibleIds])));
  };

  function exportPosts() {
    const blob = new Blob([createPostsCsv(filteredPosts)], { type: "text/csv;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "posts.csv";
    link.click();
    URL.revokeObjectURL(downloadUrl);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-slate-600">Loading posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Posts Management</h1>
          <p className="text-slate-500 mt-1">{filteredPosts.length} post(s) found</p>
        </div>
        <Link
          href="/posts/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          <span>✏️</span>
          Create Post
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Filters & Sort</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="filter-content" className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Content:
            </label>
            <input
              id="filter-content"
              type="text"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Search title or content..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label htmlFor="filter-tag" className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Tag:
            </label>
            <input
              id="filter-tag"
              type="text"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              placeholder="Tag name..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label htmlFor="filter-date" className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Date Created:
            </label>
            <input
              id="filter-date"
              type="text"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              placeholder="MM/DD/YYYY"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-slate-700 mb-2">
              Sort By:
            </label>
            <select
              id="sort-by"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="date-desc">Date (Newest)</option>
            </select>
          </div>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-blue-900">
            {selectedIds.length} post(s) selected
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => bulkSetStatus(true)}
              className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
            >
              Publish selected
            </button>
            <button
              type="button"
              onClick={() => bulkSetStatus(false)}
              className="px-3 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition"
            >
              Move to draft
            </button>
            <button
              type="button"
              onClick={bulkDeleteSelected}
              className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
            >
              Delete selected
            </button>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-slate-500 text-lg">No posts found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={exportPosts}
              className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
            >
              Export CSV
            </button>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-3 py-2 rounded-lg shadow border border-slate-200">
              <input
                type="checkbox"
                checked={filteredPosts.every((post) => selectedIds.includes(post.id)) && filteredPosts.length > 0}
                onChange={selectAllVisible}
                aria-label="Select all visible posts"
              />
              Select all
            </label>
          </div>
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden flex"
            >
              <div className="flex items-center pl-4">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(post.id)}
                  onChange={() =>
                    setSelectedIds((current) =>
                      current.includes(post.id)
                        ? current.filter((id) => id !== post.id)
                        : [...current, post.id]
                    )
                  }
                  aria-label={`Select ${post.title}`}
                />
              </div>

              {/* Image */}
              <div className="w-32 h-32 flex-shrink-0 overflow-hidden bg-slate-200">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600">
                        <Link href={`/post/${post.urlId}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => togglePostStatus(post.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                          post.active
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {post.active ? "Published" : "Draft"}
                      </button>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="flex gap-4 mt-3 text-sm text-slate-500">
                    <span>Posted on {post.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span>{post.category}</span>
                    <span>{post.views} views</span>
                  </div>

                  {/* Tags */}
                  {post.tags && (
                    <p className="mt-3 text-xs text-slate-600">
                      {post.tags
                        .split(",")
                        .map((t) => `#${t.trim()}`)
                        .join(", ")}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  <Link
                    href={`/post/${post.urlId}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/post/${post.urlId}`}
                    target="_blank"
                    className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-sm font-medium hover:bg-slate-300 transition"
                  >
                    Preview
                  </Link>
                  <button
                    type="button"
                    onClick={() => deletePost(post.id, post.title)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}