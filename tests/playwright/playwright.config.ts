import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

import fs from "fs";
import path from "path";

// Define the directory path
const authDir = path.resolve(".auth");

// Create .auth directory if it doesn't exist
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir);
  console.log(".auth directory created");
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  globalSetup: "./global-setup.ts",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["list"]], // process.env.CI ? [["list"]] : [["list"], ["html"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3002",

    /* I use custom test id attribute */
    testIdAttribute: "data-test-id",

    /* Retain the action log for every failed test. */
    trace: "retain-on-failure",
    /* Screenshot only on failure */
    screenshot: "only-on-failure",

    /* Video only on failure */
    video: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "admin",
      testDir: "./tests/admin",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3002",
      },
      dependencies: ["setup"],
    },
    {
      name: "web",
      testDir: "./tests/web",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3001",
      },
      dependencies: ["setup"],
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    //   dependencies: process.env.CI ? ["setup"] : [],
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: process.env.PW_SKIP_WEBSERVER
    ? undefined
    : [
        {
          reuseExistingServer: !process.env.CI,
          command: "pnpm --filter admin dev --port 3002",
          url: "http://localhost:3002",
        },
        {
          reuseExistingServer: !process.env.CI,
          command: "pnpm --filter web dev --port 3001",
          url: "http://localhost:3001",
        },
      ],
});
