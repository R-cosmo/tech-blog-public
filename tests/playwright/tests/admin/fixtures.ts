import "dotenv/config";

import { execFileSync } from "node:child_process";
import path from "node:path";
import { test as base, type BrowserContext, type Page } from "@playwright/test";

export const e2epassword = "superpassword";

// TODO: Implement seed
export async function seedData(...options: any[]) {}

// Declare the types of your fixtures.
type MyFixtures = {
  resetDatabase: void;
  userPage: Page;
};

type AppOptions = {};

export function createOptions(options: Partial<AppOptions>) {
  return JSON.stringify({});
}

export async function setOptions(
  context: BrowserContext,
  options: Partial<AppOptions>,
) {
  await context.addCookies([
    {
      name: "options",
      url: process.env.VERCEL_URL,
      value: createOptions(options),
    },
  ]);
}

export * from "@playwright/test";
export const test = base.extend<MyFixtures>({
  resetDatabase: [
    async ({}, use) => {
      const databasePath = path.resolve(
        process.cwd(),
        "..",
        "..",
        "packages/db/prisma/dev.db",
      );

      execFileSync(
        process.platform === "win32" ? "node.exe" : "node",
        ["-e", "import('@repo/db/seed').then(({ seed }) => seed())"],
        {
          stdio: "ignore",
          env: { ...process.env, DATABASE_URL: `file:${databasePath}` },
        },
      );

      await use();
    },
    { auto: true },
  ],
  // adminPage: async ({ browser }, use) => {
  //   const context = await browser.newContext({
  //     storageState: ".auth/admin.json",
  //   });
  //   const adminPage = await context.newPage(); //  new AdminPage(await context.newPage());
  //   await use(adminPage);
  //   await context.close();
  // },
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: ".auth/user.json",
    });
    const userPage = await context.newPage(); //  new UserPage(await context.newPage());
    if (process.env.PWDEBUG) {
      await userPage.pause();
    }
    await use(userPage);
    await context.close();
  },
});
