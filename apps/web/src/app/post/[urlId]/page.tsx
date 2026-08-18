import { AppLayout } from "@/components/Layout/AppLayout";
import { posts } from "@repo/db/data";

// Minimal inline markdown converter (only for 2.1 temporary assignment purposes)
function markdownToHtml(md: string): string {
  let html = md;

  // Headings
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");

  // Line breaks
  html = html.replace(/\n/g, "<br />");

  return html.trim();
}

export default function Page({ params }: { params: { urlId: string } }) {
  const { urlId } = params;

  const post = posts.find((p) => p.urlId === urlId);

  if (!post) {
    return <AppLayout>Article not found</AppLayout>;
  }

  const htmlContent = markdownToHtml(post.content);
  const tagList = post.tags.split(",").map(t => t.trim());


  return (
    <AppLayout>
      <article className="prose mx-auto py-10">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="rounded-lg mb-6"
          />
        )}

        <div className="text-sm text-gray-500 mb-6">
          <p>Category: {post.category}</p>
          <p>Tags: {tagList.join(", ")}</p>
          <p>
            Date:{" "}
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p>Likes: {post.likes}</p>
          <p>Views: {post.views}</p>
        </div>

        <div
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </AppLayout>
  );
}
