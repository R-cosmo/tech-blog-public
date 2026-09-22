import { execFileSync } from "node:child_process";

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
}

