"use client";

import { useEffect, useState } from "react";

type Comment = {
  id: string;
  postId: number;
  parentId: string | null;
  author: string;
  content: string;
  createdAt: string;
};

type UserSession = {
  username: string;
  role: "user" | "admin" | "editor";
};

type CommentNode = Comment & { children: CommentNode[] };

/**
 * Groups the flat API response into a tree that can be rendered recursively.
 * A comment whose parent cannot be found is treated as a root so one bad
 * relationship does not hide the rest of the discussion.
 */
function buildTree(comments: Comment[]): CommentNode[] {
  const nodes = new Map<string, CommentNode>();
  comments.forEach((comment) => nodes.set(comment.id, { ...comment, children: [] }));

  const roots: CommentNode[] = [];
  nodes.forEach((node) => {
    if (node.parentId && nodes.has(node.parentId)) {
      nodes.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function CommentForm({
  onSubmit,
  submitLabel,
  defaultAuthor = "",
}: {
  onSubmit: (author: string, content: string) => Promise<void>;
  submitLabel: string;
  defaultAuthor?: string;
}) {
  const [author, setAuthor] = useState(defaultAuthor);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setAuthor(defaultAuthor);
  }, [defaultAuthor]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // Prevent empty comments and avoid sending duplicate requests while posting.
    if (!author.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(author.trim(), content.trim());
      setContent("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
        placeholder="Your name"
        readOnly={Boolean(defaultAuthor)}
        data-test-id="comment-author-input"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
      />
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Write a comment..."
        rows={3}
        data-test-id="comment-content-input"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
      />
      <button
        type="submit"
        disabled={submitting}
        data-test-id="comment-submit-button"
        className="self-start rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Posting..." : submitLabel}
      </button>
    </form>
  );
}

function CommentItem({
  comment,
  onReply,
}: {
  comment: CommentNode;
  onReply: (parentId: string, author: string, content: string) => Promise<void>;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <li className="flex flex-col gap-2" data-test-id="comment-item">
      <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {comment.author}
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
            {new Date(comment.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
        <button
          type="button"
          onClick={() => setReplying((current) => !current)}
          className="mt-2 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {replying ? "Cancel" : "Reply"}
        </button>

        {replying && (
          <div className="mt-3">
            <CommentForm
              submitLabel="Reply"
              defaultAuthor={comment.author}
              onSubmit={async (author, content) => {
                await onReply(comment.id, author, content);
                setReplying(false);
              }}
            />
          </div>
        )}
      </div>

      {comment.children.length > 0 && (
        <ul className="ml-6 flex flex-col gap-2 border-l border-slate-200 pl-4 dark:border-slate-700">
          {comment.children.map((child) => (
            <CommentItem key={child.id} comment={child} onReply={onReply} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserSession | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    // Load comments and the optional user session whenever the displayed post changes.
    fetch(`/api/comments?postId=${postId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setComments(data))
      .finally(() => setLoading(false));

    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null));
  }, [postId]);

  async function handleLogin() {
    setLoggingIn(true);
    setLoginError("");

    const response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: loginForm.username,
        password: loginForm.password,
      }),
    });

    const data = await response.json();
    setLoggingIn(false);

    if (!response.ok) {
      setLoginError(data.error || "Unable to log in");
      return;
    }

    setUser({ username: data.username, role: data.role });
    setLoginForm({ username: "", password: "" });
  }

  async function handleLogout() {
    await fetch("/api/user", { method: "DELETE" });
    setUser(null);
  }

  async function submitComment(author: string, content: string, parentId?: string) {
    // Authenticated users always post under their session name, not a client-edited name.
    const safeAuthor = user?.username || author;
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, author: safeAuthor, content, parentId }),
    });
    if (response.ok) {
      const created = await response.json();
      setComments((current) => [...current, created]);
    }
  }

  const tree = buildTree(comments);

  return (
    <section data-test-id="comment-section" className="mt-10 flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {user ? (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
          <span>Logged in as {user.username}</span>
          <button type="button" onClick={handleLogout} className="font-medium underline">
            Log out
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">
            Sign in to post as a normal user
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
            />
            <button
              type="button"
              onClick={handleLogin}
              disabled={loggingIn}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loggingIn ? "Logging in..." : "Login"}
            </button>
          </div>
          {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
        </div>
      )}

      <CommentForm
        submitLabel="Post comment"
        defaultAuthor={user?.username ?? ""}
        onSubmit={(author, content) => submitComment(author, content)}
      />

      {loading ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading comments...</p>
      ) : tree.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No comments yet. Be the first to comment!</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {tree.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(parentId, author, content) => submitComment(author, content, parentId)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
