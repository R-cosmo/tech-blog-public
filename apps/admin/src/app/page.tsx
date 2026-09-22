import { isLoggedIn } from "../utils/auth";
import { LoginForm } from "./LoginForm";
import { AdminLayout } from "../components/AdminLayout";
import { PostList } from "./PostList";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Renders the admin landing page and redirects unauthenticated users to the login form.
 *
 * @returns {Promise<JSX.Element>} The admin dashboard or login screen depending on the current authentication state.
 */
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
