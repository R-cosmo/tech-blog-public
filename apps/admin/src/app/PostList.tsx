"use client";

import { posts } from "@repo/db/data";
import Link from "next/link";
import { useMemo, useState } from "react";

export function PostList() {
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState("date-desc");
  const filteredPosts = useMemo(() => posts.filter((post) => {
    const searchable = `${post.title} ${post.content}`.toLowerCase();
    const dateText = `${String(post.date.getMonth() + 1).padStart(2, "0")}${String(post.date.getDate()).padStart(2, "0")}${post.date.getFullYear()}`;
    const dateFilter = date.replaceAll("/", "");
    const isAfterDate = !dateFilter || dateFilter.length < 8 || dateText >= dateFilter;
    return searchable.includes(content.toLowerCase()) && post.tags.toLowerCase().includes(tag.toLowerCase()) && isAfterDate;
  }).sort((left, right) => {
    if (sort.startsWith("title")) {
      const comparison = left.title.localeCompare(right.title);
      return sort === "title-asc" ? comparison : -comparison;
    }
    const comparison = left.date.getTime() - right.date.getTime();
    return sort === "date-asc" ? comparison : -comparison;
  }), [content, date, sort, tag]);

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.reload();
  }

  return <>
    <header><h1>Admin of Full Stack Blog</h1><button onClick={logout}>Logout</button></header>
    <section>
      <label>Filter by Content:<input value={content} onChange={(event) => setContent(event.target.value)} /></label>
      <label>Filter by Tag:<input value={tag} onChange={(event) => setTag(event.target.value)} /></label>
      <label>Filter by Date Created:<input value={date} onChange={(event) => setDate(event.target.value)} /></label>
      <label>Sort By:<select value={sort} onChange={(event) => setSort(event.target.value)}>
        <option value="title-asc">Title ascending</option><option value="title-desc">Title descending</option>
        <option value="date-asc">Date ascending</option><option value="date-desc">Date descending</option>
      </select></label>
    </section>
    <Link href="/posts/create">Create Post</Link>
    {filteredPosts.map((post) => <article key={post.id}>
      <img src={post.imageUrl} alt={post.title} /><Link href={`/post/${post.urlId}`}>{post.title}</Link>
      <p>{post.description}</p><p>#{post.tags.replaceAll(",", ", #")}</p>
      <p>Posted on {post.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
      <p>{post.category}</p><button>{post.active ? "Active" : "Inactive"}</button>
    </article>)}
  </>;
}