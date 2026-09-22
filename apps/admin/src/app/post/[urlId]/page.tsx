import { isLoggedIn } from "../../../utils/auth";
import { LoginForm } from "../../LoginForm";
import { AdminLayout } from "../../../components/AdminLayout";
import { PostForm } from "../../PostForm";
import { cookies } from "next/headers";

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

export default async function UpdatePost({ params }: { params: Promise<{ urlId: string }> }) {
  if (!(await isLoggedIn())) return <LoginForm />;
  
  const { urlId } = await params;
  const cookieHeader = (await cookies()).toString();
  
  // Fetch all posts and find the one with matching urlId
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"}/api/posts`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      return (
        <AdminLayout>
          <h1 className="text-3xl font-bold text-slate-900">Post not found</h1>
        </AdminLayout>
      );
    }

    const posts = await response.json();
    const post = posts.find((p: any) => p.urlId === urlId);

    if (!post) {
      return (
        <AdminLayout>
          <h1 className="text-3xl font-bold text-slate-900">Post not found</h1>
        </AdminLayout>
      );
    }

    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-slate-900">Modify Post</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <PostForm post={post} />
          </div>
        </div>
      </AdminLayout>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    return (
      <AdminLayout>
        <h1 className="text-3xl font-bold text-slate-900">Error loading post</h1>
      </AdminLayout>
    );
  }
}