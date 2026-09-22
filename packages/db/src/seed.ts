import { posts } from "./data.js";
import { client } from "./client.js";

export async function seed() {
  console.log("🌱 Seeding data");
  const db = client.db;

  await db.like.deleteMany();
  await db.post.deleteMany();

  for (const post of posts) {
    await db.post.create({
      data: {
        title: post.title,
        content: post.content,
        category: post.category,
        description: post.description,
        imageUrl: post.imageUrl,
        tags: post.tags
          .split(",")
          .map((p: string) => p.trim())
          .join(","),
        urlId: post.urlId,
        active: post.active,
        date: post.date,
        id: post.id,
        views: post.views,
      },
    });
    for (let i = 0; i < post.likes; i++) {
      await db.like.create({
        data: {
          postId: post.id,
          userIP: `192.168.100.${i}`,
        },
      });
    }
  }
  
  console.log("✅ Seeding complete");
}
