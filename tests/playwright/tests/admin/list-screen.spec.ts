import { expect, test } from "./fixtures";

test.describe("ADMIN LIST SCREEN", () => {
  test(
    "Show all posts",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await expect(userPage.locator("article")).toHaveCount(4);
    },
  );

  test(
    "Filter by content",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // LIST SCREEN > On the top is a filter screen that allows to filter posts by Title or content
      await userPage.getByLabel("Filter by Content:").fill("Boost");
      await expect(userPage.locator("article")).toHaveCount(1);
      await expect(
        userPage.getByText("Boost your conversion rate"),
      ).toBeVisible();

      await userPage.getByLabel("Filter by Content:").fill("post2");
      await expect(
        userPage.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();

      await userPage.getByLabel("Filter by Content:").clear();
      await expect(userPage.locator("article")).toHaveCount(4);
    },
  );

  test(
    "Filter by tag",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // LIST SCREEN > On the top is a filter screen that allows to filter posts by tags
      await userPage.getByLabel("Filter by Tag:").fill("Front");
      await expect(userPage.locator("article")).toHaveCount(2);
      await expect(
        userPage.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();
      await expect(
        userPage.getByText("No front end framework is the best"),
      ).toBeVisible();
      await userPage.getByLabel("Filter by Tag:").clear();
    },
  );

  test(
    "Filter by date",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // LIST SCREEN > On the top is a filter screen that allows to filter posts by date
      await userPage
        .getByLabel("Filter by Date Created:")
        .pressSequentially("01012022");
      await expect(userPage.locator("article")).toHaveCount(2);
      await expect(
        userPage.getByText("Boost your conversion rate"),
      ).toBeVisible();
      await expect(
        userPage.getByText("No front end framework is the best"),
      ).toBeVisible();
      await userPage.getByLabel("Filter by Date Created:").clear();
    },
  );

  test(
    "Combine Filters",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // LIST SCREEN > On the top is a filter screen that allows to filter by visibility
      await userPage.getByLabel("Filter by Tag:").fill("Front");
      await userPage
        .getByLabel("Filter by Date Created:")
        .pressSequentially("01012022");
      await expect(userPage.locator("article")).toHaveCount(1);
      await expect(
        userPage.getByText("No front end framework is the best"),
      ).toBeVisible();
    },
  );

  test(
    "Sort items",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // LIST SCREEN > Users can sort posts by name or creation date, both ascending and descending

      // title-asc
      await userPage.getByLabel("Sort By:").selectOption("title-asc");
      let articles = await userPage.locator("article").all();

      expect(await articles[0].innerText()).toContain(
        "Better front ends with Fatboy Slim",
      );
      expect(await articles[1].innerText()).toContain(
        "Boost your conversion rate",
      );
      expect(await articles[2].innerText()).toContain(
        "No front end framework is the best",
      );
      expect(await articles[3].innerText()).toContain(
        "Visual Basic is the future",
      );

      // title-desc
      await userPage.getByLabel("Sort By:").selectOption("title-desc");
      articles = await userPage.locator("article").all();

      expect(await articles[3].innerText()).toContain(
        "Better front ends with Fatboy Slim",
      );
      expect(await articles[2].innerText()).toContain(
        "Boost your conversion rate",
      );
      expect(await articles[1].innerText()).toContain(
        "No front end framework is the best",
      );
      expect(await articles[0].innerText()).toContain(
        "Visual Basic is the future",
      );

      // title-asc
      await userPage.getByLabel("Sort By:").selectOption("date-asc");
      articles = await userPage.locator("article").all();

      expect(await articles[1].innerText()).toContain(
        "Better front ends with Fatboy Slim",
      );
      expect(await articles[2].innerText()).toContain(
        "Boost your conversion rate",
      );
      expect(await articles[3].innerText()).toContain(
        "No front end framework is the best",
      );
      expect(await articles[0].innerText()).toContain(
        "Visual Basic is the future",
      );

      // title-desc
      await userPage.getByLabel("Sort By:").selectOption("date-desc");
      articles = await userPage.locator("article").all();

      expect(await articles[2].innerText()).toContain(
        "Better front ends with Fatboy Slim",
      );
      expect(await articles[1].innerText()).toContain(
        "Boost your conversion rate",
      );
      expect(await articles[0].innerText()).toContain(
        "No front end framework is the best",
      );
      expect(await articles[3].innerText()).toContain(
        "Visual Basic is the future",
      );
    },
  );

  test(
    "List items",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // LIST SCREEN > The list post item displays the image, title of the post and metadata
      const article = await userPage.locator("article").first();
      await expect(
        article.getByText("No front end framework is the best"),
      ).toBeVisible();
      await expect(article.locator("img").first()).toBeVisible();

      // LIST SCREEN > The list post items display metadata such as category, tags, and "active" status
      await expect(article.getByText("#Front-End, #Dev Tools")).toBeVisible();
      await expect(article.getByText("Posted on Dec 16, 2024")).toBeVisible();
      await expect(article.getByText("React")).toBeVisible();
      await expect(article.getByText("Published")).toBeVisible();

      // LIST SCREEN > The active status is a button that, on click, just displays a message
      await expect(article.locator('button:has-text("Published")')).toBeVisible();
    },
  );

  test(
    "Move to detail screen",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // LIST SCREEN > Clicking on the title takes the user to the MODIFY SCREEN, allowing the user to modify the current post
      await userPage.getByText("No front end framework is the best").click();
      await expect(userPage).toHaveURL(
        "/post/no-front-end-framework-is-the-best",
      );
    },
  );

  test(
    "Move to create post screen",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // LIST SCREEN > There is a button to create new posts
      await expect(userPage.getByText("Create Post")).toBeVisible();

      // LIST SCREEN > Clicking on the "Create Post" button takes the user to the CREATE SCREEN
      await userPage.locator('a:has-text("Create Post")').click();
      await expect(userPage).toHaveURL("/posts/create");
    },
  );

  test(
    "Export filtered posts as CSV",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await userPage.getByLabel("Filter by Content:").fill("Boost");

      const downloadPromise = userPage.waitForEvent("download");
      await userPage.getByRole("button", { name: "Export CSV" }).click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe("posts.csv");
      const csv = await (await download.createReadStream())?.toArray();
      const csvText = Buffer.concat(csv ?? []).toString("utf8");

      expect(csvText).toContain("id,urlId,title");
      expect(csvText).toContain("Boost your conversion rate");
      expect(csvText).not.toContain("Better front ends with Fatboy Slim");
    },
  );

  test(
    "Selects all visible posts for a bulk action",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await userPage.getByLabel("Select all visible posts").check();

      await expect(userPage.getByText("4 post(s) selected")).toBeVisible();
      await expect(
        userPage.getByRole("button", { name: "Move to draft" }),
      ).toBeVisible();
      await expect(
        userPage.getByRole("button", { name: "Delete selected" }),
      ).toBeVisible();
    },
  );

  test(
    "Moves all selected posts to drafts",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await userPage.getByLabel("Select all visible posts").check();
      await userPage.getByRole("button", { name: "Move to draft" }).click();

      await expect(userPage.locator("article").getByText("Draft")).toHaveCount(4);
      await expect(userPage.getByText("0 post(s) selected")).not.toBeVisible();
    },
  );

  test(
    "Can activate / deactivate posts",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      //  BACKEND / ADMIN / LIST SCREEN > Logged in user can activate / deactivate a post clicking on the activate button, automatically saving changes

      let article = await userPage.locator("article").first();
      await expect(article.locator('button:has-text("Published")')).toBeVisible();
      await expect(
        article.locator('button:has-text("Draft")'),
      ).not.toBeVisible();

      await article.locator('button:has-text("Published")').click();

      article = await userPage.locator("article").first();
      await expect(
        article.getByText("Published", { exact: true }),
      ).not.toBeVisible();
      await expect(
        article.getByText("Draft", { exact: true }),
      ).toBeVisible();

      // reload page and check

      await userPage.reload();

      article = await userPage.locator("article").first();
      await expect(
        article.getByText("Published", { exact: true }),
      ).not.toBeVisible();
      await expect(
        article.getByText("Draft", { exact: true }),
      ).toBeVisible();
    },
  );
});
