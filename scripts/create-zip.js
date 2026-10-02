import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const parentDir = path.resolve(rootDir, "..");

const zipName = "krait-abyss-website-complete.zip";
const destInParent = path.join(parentDir, zipName);
const destInRoot = path.join(rootDir, zipName);

console.log("=================================================");
console.log("  KRAIT ABYSS - PROJECT ARCHIVE PACKAGER");
console.log("=================================================");
console.log(`Source Directory : ${rootDir}`);
console.log(`Target Archive   : ${destInParent}`);

// Excluded patterns
const excludes = [
  "--exclude=node_modules",
  "--exclude=.output",
  "--exclude=.tanstack",
  "--exclude=.wrangler",
  "--exclude=.git",
  "--exclude=*.zip",
  "--exclude=dist",
  "--exclude=.vinxi",
];

try {
  // Use native tar (libarchive) available in Windows 10/11 & macOS/Linux
  const cmd = `tar -a -c -f "${destInParent}" ${excludes.join(" ")} .`;
  execSync(cmd, { cwd: rootDir, stdio: "inherit" });

  const stats = fs.statSync(destInParent);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

  // Also copy a duplicate to root for convenient direct access
  fs.copyFileSync(destInParent, destInRoot);

  console.log("-------------------------------------------------");
  console.log(`[SUCCESS] Archive created successfully!`);
  console.log(`File Size        : ${sizeMb} MB`);
  console.log(`Location 1       : ${destInParent}`);
  console.log(`Location 2 (Root): ${destInRoot}`);
  console.log("-------------------------------------------------");
  console.log("All unnecessary files (node_modules, build cache, .output) were excluded.");
} catch (error) {
  console.error(
    "[ERROR] Failed to package archive with tar, attempting PowerShell fallback...",
    error,
  );
  try {
    const psCmd = `powershell -NoProfile -Command "Get-ChildItem -Path '${rootDir}' -Exclude node_modules,.output,.tanstack,.wrangler,*.zip | Compress-Archive -DestinationPath '${destInParent}' -Force"`;
    execSync(psCmd, { stdio: "inherit" });
    fs.copyFileSync(destInParent, destInRoot);
    console.log(`[SUCCESS] PowerShell Compress-Archive created: ${destInParent}`);
  } catch (psErr) {
    console.error("[ERROR] Zip creation failed:", psErr);
    process.exit(1);
  }
}
