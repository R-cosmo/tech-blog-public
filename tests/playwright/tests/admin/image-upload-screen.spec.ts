import path from "node:path";
import { expect, test } from "./fixtures";

const testImagePath = path.resolve(process.cwd(), "../storybook/stories/assets/docs.png");

test.describe("ADMIN IMAGE UPLOAD", () => {
  test(
    "Uploads a selected image to Cloudinary and fills the image URL field",
    { tag: "@a4" },
    async ({ userPage }) => {
      // Intercept the Cloudinary upload request so the test doesn't depend on a live account
      await userPage.route("https://api.cloudinary.com/**/image/upload", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ secure_url: "https://res.cloudinary.com/demo/image/upload/test.jpg" }),
        });
      });

      await userPage.goto("/post/no-front-end-framework-is-the-best");

      const fileChooserPromise = userPage.waitForEvent("filechooser");
      await userPage.getByText("Upload image").click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(testImagePath);

      await expect(userPage.getByLabel("Image URL")).toHaveValue(
        "https://res.cloudinary.com/demo/image/upload/test.jpg",
      );
      await expect(userPage.getByTestId("image-preview")).toHaveAttribute(
        "src",
        "https://res.cloudinary.com/demo/image/upload/test.jpg",
      );
    },
  );

  test(
    "Shows an error message when the upload fails",
    { tag: "@a4" },
    async ({ userPage }) => {
      await userPage.route("https://api.cloudinary.com/**/image/upload", async (route) => {
        await route.fulfill({ status: 500, body: "Upload failed" });
      });

      await userPage.goto("/post/no-front-end-framework-is-the-best");

      const fileChooserPromise = userPage.waitForEvent("filechooser");
      await userPage.getByText("Upload image").click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(testImagePath);

      await expect(
        userPage.getByText("Image upload failed. Please try again or paste an image URL."),
      ).toBeVisible();
    },
  );
});
