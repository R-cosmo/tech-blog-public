import { isLoggedIn } from "../../../utils/auth";
import { LoginForm } from "../../LoginForm";
import { AdminLayout } from "../../../components/AdminLayout";
import { PostForm } from "../../PostForm";

export default async function CreatePost() {
  if (!(await isLoggedIn())) return <LoginForm />;
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-slate-900">Create New Post</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <PostForm />
        </div>
      </div>
    </AdminLayout>
  );
}