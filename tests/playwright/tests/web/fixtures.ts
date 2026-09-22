import "dotenv/config";

import { execFileSync } from "node:child_process";
import path from "node:path";
import { type BrowserContext } from "@playwright/test";
import { test as base } from "@playwright/test";
// TODO: Implement seed
export async function seedData(...options: any[]) {
  /* After assignment two, move the hard coded data to the seed */
}

type AppOptions = {};

type MyFixtures = {
  resetDatabase: void;
};

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
});
