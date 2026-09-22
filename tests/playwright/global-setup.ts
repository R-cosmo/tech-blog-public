import { execFileSync } from "node:child_process";
import path from "node:path";

export default async function globalSetup() {
  const databasePath = path.resolve(
    process.cwd(),
    "..",
    "..",
    "packages/db/prisma/dev.db",
  );

  execFileSync(
    process.platform === "win32" ? "node.exe" : "node",
    [
      "-e",
      "import('@repo/db/seed').then(({ seed }) => seed())",
    ],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: `file:${databasePath}`,
      },
    },
  );
}
