"use client";

import { marked } from "marked";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { uploadImageToCloudinary } from "../utils/cloudinary";

type Post = {
  id: number;
  urlId: string;
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
};

type PostFormProps = { post?: Post };

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [values, setValues] = useState({
    title: post?.title ?? "",
    category: post?.category ?? "",
    description: post?.description ?? "",
    content: post?.content ?? "",
    imageUrl: post?.imageUrl ?? "",
    tags: post?.tags ?? "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const cursor = useRef({ start: 0, end: 0 });

  const update = (name: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    setSaved(false);
  };

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      update("imageUrl", url);
    } catch (error) {
      setErrors(["Image upload failed. Please try again or paste an image URL."]);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  async function save() {
    const nextErrors: string[] = [];
    if (!values.title.trim()) nextErrors.push("Title is required");
    if (!values.description.trim()) nextErrors.push("Description is required");
    if (values.description.length > 200) nextErrors.push("Description is too long. Maximum is 200 characters");
    if (!values.content.trim()) nextErrors.push("Content is required");
    if (!values.imageUrl.trim()) nextErrors.push("Image URL is required");
    else if (!URL.canParse(values.imageUrl)) nextErrors.push("This is not a valid URL");
    if (!values.tags.trim()) nextErrors.push("At least one tag is required");
    
    setErrors(nextErrors);
    
    if (nextErrors.length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const method = post ? "PUT" : "POST";
      const url = post ? `/api/posts/${post.id}` : "/api/posts";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          category: values.category,
          description: values.description,
          content: values.content,
          imageUrl: values.imageUrl,
          tags: values.tags,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrors([error.error || "Failed to save post"]);
        setIsLoading(false);
        return;
      }

      setSaved(true);
      setIsLoading(false);
    } catch (error) {
      setErrors(["An error occurred while saving the post"]);
      setIsLoading(false);
    }
  }

  function togglePreview() {
    if (!preview) {
      const textarea = document.getElementById("content") as HTMLTextAreaElement;
      cursor.current = { start: textarea.selectionStart, end: textarea.selectionEnd };
    }
    setPreview((current) => !current);
    if (preview) {
      requestAnimationFrame(() => {
        const textarea = document.getElementById("content") as HTMLTextAreaElement;
        textarea.focus();
        textarea.setSelectionRange(cursor.current.start, cursor.current.end);
      });
    }
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); save(); }} className="space-y-6">
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-900 mb-2">Please fix the following errors:</h3>
          <ul className="list-disc list-inside space-y-1 text-red-800 text-sm">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          ✅ Post updated successfully! Redirecting...
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-900 mb-2">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="Enter post title"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-slate-900 mb-2">
          Category
        </label>
        <input
          id="category"
          type="text"
          value={values.category}
          onChange={(event) => update("category", event.target.value)}
          placeholder="e.g., Technology, Life, Travel"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-900 mb-2">
          Description * <span className="text-xs text-slate-500">({values.description.length}/200)</span>
        </label>
        <textarea
          id="description"
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder="Brief description of your post (max 200 characters)"
          rows={3}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-semibold text-slate-900 mb-2">
          Tags * <span className="text-xs text-slate-500">(comma separated)</span>
        </label>
        <input
          id="tags"
          type="text"
          value={values.tags}
          onChange={(event) => update("tags", event.target.value)}
          placeholder="e.g., javascript, web-dev, tutorial"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-semibold text-slate-900 mb-2">
          Image URL *
        </label>
        <input
          id="imageUrl"
          type="text"
          value={values.imageUrl}
          onChange={(event) => update("imageUrl", event.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />

        <div className="mt-2 flex items-center gap-3">
          <label
            htmlFor="imageUpload"
            className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {isUploading ? "Uploading..." : "Upload image"}
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="hidden"
          />
          <span className="text-xs text-slate-500">or paste an image URL above</span>
        </div>

        {values.imageUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border border-slate-200">
            <img
              data-test-id="image-preview"
              src={values.imageUrl}
              alt="Preview"
              className="w-full max-h-64 object-cover"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="block text-sm font-semibold text-slate-900">
            Content *
          </label>
          <button
            type="button"
            onClick={togglePreview}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition"
          >
            {preview ? "✏️ Edit" : "👁️ Preview"}
          </button>
        </div>

        {!preview ? (
          <textarea
            id="content"
            value={values.content}
            onChange={(event) => update("content", event.target.value)}
            placeholder="Write your post content (supports Markdown)..."
            rows={12}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none font-mono text-sm"
          />
        ) : (
          <div
            data-test-id="content-preview"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 prose prose-sm max-w-none p-4"
            dangerouslySetInnerHTML={{ __html: String(marked.parse(values.content)) }}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t border-slate-200">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-300 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}