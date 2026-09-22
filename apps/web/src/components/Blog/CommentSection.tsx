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

type CommentNode = Comment & { children: CommentNode[] };

/** Groups a flat comment list into a tree of replies keyed by parentId. */
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
}: {
  onSubmit: (author: string, content: string) => Promise<void>;
  submitLabel: string;
}) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setComments(data))
      .finally(() => setLoading(false));
  }, [postId]);

  async function submitComment(author: string, content: string, parentId?: string) {
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, author, content, parentId }),
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

      <CommentForm submitLabel="Post comment" onSubmit={(author, content) => submitComment(author, content)} />

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
