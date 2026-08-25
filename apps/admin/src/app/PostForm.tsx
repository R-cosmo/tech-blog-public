"use client";

import { marked } from "marked";
import { useRef, useState } from "react";
import type { Post } from "@repo/db/data";

type PostFormProps = { post?: Post };

export function PostForm({ post }: PostFormProps) {
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
  const cursor = useRef({ start: 0, end: 0 });
  const update = (name: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    setSaved(false);
  };

  function save() {
    const nextErrors: string[] = [];
    if (!values.title.trim()) nextErrors.push("Title is required");
    if (!values.description.trim()) nextErrors.push("Description is required");
    if (values.description.length > 200) nextErrors.push("Description is too long. Maximum is 200 characters");
    if (!values.content.trim()) nextErrors.push("Content is required");
    if (!values.imageUrl.trim()) nextErrors.push("Image URL is required");
    else if (!URL.canParse(values.imageUrl)) nextErrors.push("This is not a valid URL");
    if (!values.tags.trim()) nextErrors.push("At least one tag is required");
    setErrors(nextErrors);
    setSaved(nextErrors.length === 0);
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

  return <form onSubmit={(event) => { event.preventDefault(); save(); }}>
    <label>Title<input value={values.title} onChange={(event) => update("title", event.target.value)} /></label>
    {!values.title.trim() && errors.includes("Title is required") && <p>Title is required</p>}
    <label>Category<input value={values.category} onChange={(event) => update("category", event.target.value)} /></label>
    <label>Description<textarea value={values.description} onChange={(event) => update("description", event.target.value)} /></label>
    {errors.includes("Description is required") && <p>Description is required</p>}
    {errors.includes("Description is too long. Maximum is 200 characters") && <p>Description is too long. Maximum is 200 characters</p>}
    <label>Content{preview ? <div data-testid="content-preview" data-test-id="content-preview" dangerouslySetInnerHTML={{ __html: String(marked.parse(values.content)) }} /> : <textarea id="content" value={values.content} onChange={(event) => update("content", event.target.value)} />}</label>
    {errors.includes("Content is required") && <p>Content is required</p>}
    <button type="button" onClick={togglePreview}>{preview ? "Close Preview" : "Preview"}</button>
    <label>Tags<input value={values.tags} onChange={(event) => update("tags", event.target.value)} /></label>
    {errors.includes("At least one tag is required") && <p>At least one tag is required</p>}
    <label>Image URL<input value={values.imageUrl} onChange={(event) => update("imageUrl", event.target.value)} /></label>
    {errors.includes("Image URL is required") && <p>Image URL is required</p>}
    {errors.includes("This is not a valid URL") && <p>This is not a valid URL</p>}
    {values.imageUrl && <img data-testid="image-preview" data-test-id="image-preview" src={values.imageUrl} alt="Preview" />}
    <button type="submit">Save</button>
    {errors.length > 0 && <p>Please fix the errors before saving</p>}
    {saved && <p>Post {post ? "updated" : "updated"} successfully</p>}
  </form>;
}