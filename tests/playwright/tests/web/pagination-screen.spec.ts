import { execFileSync } from "node:child_process";
import { expect, test } from "./fixtures";

/** Creates 4 extra active posts in a short-lived child process to avoid holding a long-lived Prisma client open in the test worker. */
function seedExtraPosts() {
  const script = `
    import('@repo/db').then(async ({ db }) => {
      for (let i = 0; i < 4; i++) {
        await db.post.create({
          data: {
            title: 'Extra Post ' + i,
            urlId: 'extra-post-' + i,
            description: 'Extra post for pagination testing',
            content: 'Extra content',
            imageUrl: 'https://example.com/image.jpg',
            category: 'Extra',
            tags: 'Extra',
            active: true,
          },
        });
      }
      process.exit(0);
    });
  `;

  execFileSync(process.platform === "win32" ? "node.exe" : "node", ["-e", script], {
    stdio: "inherit",
    env: process.env,
  });
}

test.describe("PAGINATION", () => {
  test(
    "Loads more posts on click when there are more than the page size",
    { tag: "@a4" },
    async ({ page }) => {
      seedExtraPosts();

      await page.goto("/");

      // Only the first page of posts is rendered initially
      await expect(page.locator("article")).toHaveCount(5);

      const loadMoreButton = page.getByTestId("load-more-button");
      await expect(loadMoreButton).toBeVisible();

      await loadMoreButton.click();

      // Remaining posts (3 seeded active + 4 extra = 7 total) are now shown
      await expect(page.locator("article")).toHaveCount(7);
      await expect(page.getByTestId("load-more-button")).not.toBeVisible();
    },
  );

  test(
    "Does not show a load-more button when all posts fit on one page",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/");

      await expect(page.locator("article")).toHaveCount(3);
      await expect(page.getByTestId("load-more-button")).not.toBeVisible();
    },
  );
});
