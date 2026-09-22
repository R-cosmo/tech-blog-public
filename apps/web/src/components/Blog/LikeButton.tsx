"use client";

import { useEffect, useRef, useState } from "react";

export function LikeButton({
  postId,
  initialCount,
}: {
  postId: number;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const interactionCount = useRef(0);

  useEffect(() => {
    fetch(`/api/likes?postId=${postId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && interactionCount.current === 0) {
          setLiked(data.liked);
          setCount(data.likeCount);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [postId]);

  async function toggleLike() {
    if (loading) return;
    interactionCount.current += 1;
    setLoading(true);
    try {
      if (liked) {
        setLiked(false);
        setCount((c) => Math.max(0, c - 1));
        void fetch(`/api/likes?postId=${postId}`, { method: "DELETE" });
      } else {
        const res = await fetch("/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });
        if (res.ok) {
          setLiked(true);
          setCount((c) => c + 1);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="flex items-center gap-2">
      <span>{count} likes</span>
      <button
        type="button"
        data-test-id="like-button"
        onClick={toggleLike}
        disabled={loading}
        aria-pressed={liked}
        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
          liked
            ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
        }`}
      >
        {liked ? "❤️ Liked" : "🤍 Like"}
      </button>
    </span>
  );
}
