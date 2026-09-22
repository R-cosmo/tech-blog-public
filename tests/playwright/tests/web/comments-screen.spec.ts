import { expect, test } from "./fixtures";

test.describe("COMMENT SYSTEM", () => {
  test(
    "Shows an empty state when there are no comments yet",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      await expect(page.getByTestId("comment-section")).toBeVisible();
      await expect(
        page.getByText("No comments yet. Be the first to comment!"),
      ).toBeVisible();
    },
  );

  test(
    "Allows posting a top-level comment",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      await page.getByTestId("comment-author-input").fill("Alice");
      await page.getByTestId("comment-content-input").fill("Great article!");
      await page.getByTestId("comment-submit-button").click();

      const comment = page.getByTestId("comment-item").filter({ hasText: "Great article!" });
      await expect(comment).toBeVisible();
      await expect(comment.getByText("Alice")).toBeVisible();

      // Comment persists across reloads
      await page.reload();
      await expect(
        page.getByTestId("comment-item").filter({ hasText: "Great article!" }),
      ).toBeVisible();
    },
  );

  test(
    "Allows replying to an existing comment, rendered nested",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      await page.getByTestId("comment-author-input").fill("Alice");
      await page.getByTestId("comment-content-input").fill("Great article!");
      await page.getByTestId("comment-submit-button").click();

      const parentComment = page.getByTestId("comment-item").filter({ hasText: "Great article!" });
      await parentComment.getByRole("button", { name: "Reply" }).click();

      await parentComment.getByTestId("comment-author-input").fill("Bob");
      await parentComment.getByTestId("comment-content-input").fill("I agree!");
      await parentComment.getByTestId("comment-submit-button").click();

      const reply = parentComment.getByTestId("comment-item").filter({ hasText: "I agree!" });
      await expect(reply).toBeVisible();
      await expect(reply.getByText("Bob")).toBeVisible();
    },
  );
});
