import { posts } from "@repo/db/data";
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";
export default function Home() {

  const activePosts = posts.filter((p) => p.active);

  return (
    <AppLayout>
      <Main posts={activePosts} className={styles.main} />
    </AppLayout>
  );
}
