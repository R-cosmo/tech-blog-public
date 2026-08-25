import { posts } from "@repo/db/data";
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";
export default function Home() {

  const visiblePosts = posts.filter((post) => post.active);


  return (
    <AppLayout>
      <Main posts={visiblePosts} className={styles.main} />
    </AppLayout>
  );
}
