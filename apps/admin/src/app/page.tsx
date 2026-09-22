import { isLoggedIn } from "../utils/auth";
import { LoginForm } from "./LoginForm";
import { AdminLayout } from "../components/AdminLayout";
import { PostList } from "./PostList";
import styles from "./page.module.css";

export default async function Home() {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach
  const loggedIn = await isLoggedIn();

  if (!loggedIn) return <LoginForm />;
  return (
    <AdminLayout>
      <PostList />
    </AdminLayout>
  );
}
