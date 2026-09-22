import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";

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
  likes: number;
  active: boolean;
};

export default async function Home() {
  try {
    const response = await fetch("http://localhost:3001/api/posts", {
      cache: "no-store",
    });

    let visiblePosts: Post[] = [];
    if (response.ok) {
      visiblePosts = await response.json();
    }

    return (
      <AppLayout>
        <Main posts={visiblePosts} className={styles.main} />
      </AppLayout>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <AppLayout>
        <Main posts={[]} className={styles.main} />
      </AppLayout>
    );
  }
}
