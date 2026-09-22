import { execFileSync } from "node:child_process";
import { chromium } from "@playwright/test";

export default async function globalSetup() {
  execFileSync(
    process.platform === "win32" ? "node.exe" : "node",
    [
      "-e",
      "import('@repo/db/seed').then(({ seed }) => seed())",
    ],
    {
      stdio: "inherit",
      env: process.env,
    },
  );

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:3002/");
  await page.getByLabel("Admin Password", { exact: true }).fill("123");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.getByRole("heading", { name: "Dashboard", exact: true }).waitFor();
  await page.context().storageState({ path: ".auth/user.json" });

  await browser.close();
}

