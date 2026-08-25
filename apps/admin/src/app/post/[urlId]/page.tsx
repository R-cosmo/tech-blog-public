import { posts } from "@repo/db/data";
import { isLoggedIn } from "../../../utils/auth";
import { LoginForm } from "../../LoginForm";
import { PostForm } from "../../PostForm";

export default async function UpdatePost({ params }: { params: Promise<{ urlId: string }> }) {
  if (!(await isLoggedIn())) return <LoginForm />;
  const { urlId } = await params;
  const post = posts.find((item) => item.urlId === urlId);
  if (!post) return <main><h1>Post not found</h1></main>;
  return <main><h1>Modify Post</h1><PostForm post={post} /></main>;
}