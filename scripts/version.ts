import { $ } from "bun";

// Check for uncommitted changes
const status = await $`git status --porcelain`.quiet();
if (status.text()) {
  console.error("There are uncommitted changes.");
  process.exit(1);
}

const newVersion = Bun.argv[3] ?? Bun.argv[2];

if (!newVersion) {
  console.error("Please enter a version number.");
  process.exit(1);
}

const versionParts = newVersion.split(".").filter((p) => !!p);
if (versionParts.length !== 3) exitInvalidVersion();
let [major, minor, patchAndMore]: string[] | number[] = versionParts;

const patchParts = patchAndMore.split("-").filter((p) => !!p);
if (patchParts.length > 2) exitInvalidVersion();

let [patch, extra]: string[] | number[] = patchParts;
try {
  [major, minor, patch] = [major, minor, patch].map((v) => parseInt(v));
  if (isNaN(major) || isNaN(minor) || isNaN(patch)) throw Error();
} catch {
  exitInvalidVersion();
}

function exitInvalidVersion() {
  console.error("Please enter a valid version number");
  process.exit(1);
}

let finalVersion = [major, minor, patch].join(".");
if (extra) finalVersion += `-${extra}`;

const packages = [
  "./game/package.json",
  "./server/package.json",
  "./protocol/package.json",
];

for (const pkg of packages) {
  const pkgJson = await Bun.file(pkg).json();
  pkgJson.version = finalVersion;
  await Bun.write(pkg, JSON.stringify(pkgJson, null, 2));
  await $`git add ${pkg}`;
}

await $`git commit -m v${finalVersion}`;
await $`git tag v${finalVersion}`;
await $`git push`;
await $`git push origin tag v${finalVersion}`;

export {};
