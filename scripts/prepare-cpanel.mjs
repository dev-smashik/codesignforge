import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const standaloneDir = resolve(root, ".next/standalone");
const deployDir = resolve(root, "cpanel-deploy");

try {
  await cp(standaloneDir, deployDir, { recursive: true, force: true });
} catch (error) {
  if (error?.code === "ENOENT") {
    console.error("Standalone build not found. Run `npm run build` first.");
    process.exitCode = 1;
  } else {
    throw error;
  }
}

if (process.exitCode) process.exit();

await mkdir(resolve(deployDir, ".next"), { recursive: true });
await cp(resolve(root, ".next/static"), resolve(deployDir, ".next/static"), {
  recursive: true,
  force: true,
});

try {
  await cp(resolve(root, "public"), resolve(deployDir, "public"), {
    recursive: true,
    force: true,
  });
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

// Ship migration inputs so cPanel can run Prisma CLI commands after install.
await cp(resolve(root, "prisma"), resolve(deployDir, "prisma"), {
  recursive: true,
  force: true,
});
await cp(resolve(root, "prisma7.config.ts"), resolve(deployDir, "prisma7.config.ts"));
await cp(resolve(root, "package.json"), resolve(deployDir, "package.json"));
await cp(resolve(root, "package-lock.json"), resolve(deployDir, "package-lock.json"));

console.log(`cPanel package prepared at ${deployDir}`);
console.log("Upload the contents of this directory to the cPanel application root.");
