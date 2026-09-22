import { expect, test } from "./fixtures";

test.describe("Extended blog journeys", () => {
  test("allows a normal user to sign in and post a comment with their username", async ({ page }) => {
    await page.goto("/post/boost-your-conversion-rate");

    await page.getByPlaceholder("Username").fill("alice");
    await page.getByPlaceholder("Password").fill("password123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Logged in as alice")).toBeVisible();
    await expect(page.getByTestId("comment-author-input")).toHaveValue("alice");

    await page.getByTestId("comment-content-input").fill("This is my logged-in comment");
    await page.getByTestId("comment-submit-button").click();

    const comment = page
      .getByTestId("comment-item")
      .filter({ hasText: "This is my logged-in comment" });

    await expect(comment).toBeVisible();
    await expect(comment.getByText("alice")).toBeVisible();

    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page.getByText("Sign in to post as a normal user")).toBeVisible();
  });

  test("supports a full article discovery flow from home to category and search results", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Boost your conversion rate")).toBeVisible();

    await page.goto("/category/react");
    await expect(page.getByText("No front end framework is the best")).toBeVisible();
    await expect(page.getByText("Better front ends with Fatboy Slim")).toBeVisible();

    await page.goto("/search?q=Fat");
    await expect(page.getByText("Better front ends with Fatboy Slim")).toBeVisible();

    await page.goto("/post/better-front-ends-with-fatboy-slim");
    await expect(
      page.getByRole("link", { name: /Better front ends with Fatboy Slim/i }),
    ).toBeVisible();
    await expect(page.getByText("Hic vel totam vitae illo").first()).toBeVisible();
  });
});
