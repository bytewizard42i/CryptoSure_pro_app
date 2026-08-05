import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const sourceRoot = path.join(projectRoot, "src");

async function listFilesRecursively(directoryPath) {
  const directoryEntries = await readdir(directoryPath, {
    withFileTypes: true,
  });
  const nestedFiles = await Promise.all(
    directoryEntries.map(async (directoryEntry) => {
      const entryPath = path.join(directoryPath, directoryEntry.name);
      if (directoryEntry.isDirectory()) {
        return listFilesRecursively(entryPath);
      }
      return [entryPath];
    }),
  );

  return nestedFiles.flat();
}

test("the user interface never imports a mode-specific provider directly", async () => {
  const userInterfaceDirectories = ["components", "layouts", "pages"];
  const userInterfaceFiles = (
    await Promise.all(
      userInterfaceDirectories.map((directoryName) =>
        listFilesRecursively(path.join(sourceRoot, directoryName)),
      ),
    )
  ).flat();

  for (const userInterfaceFile of userInterfaceFiles) {
    const source = await readFile(userInterfaceFile, "utf8");
    assert.doesNotMatch(
      source,
      /from\s+["'][^"']*providers\/(?:demoland|realdeal)(?:\/[^"']*)?["']/,
      `${path.relative(projectRoot, userInterfaceFile)} bypasses the shared provider boundary`,
    );
  }
});

test("mode-specific folders contain provider code, not a second user interface", async () => {
  for (const modeDirectory of ["demoland", "realdeal"]) {
    const modeFiles = await listFilesRecursively(
      path.join(sourceRoot, "providers", modeDirectory),
    );

    for (const modeFile of modeFiles) {
      assert.equal(
        path.extname(modeFile),
        ".ts",
        `${path.relative(projectRoot, modeFile)} creates mode-specific presentation code`,
      );
    }
  }
});

test("one provider factory selects DemoLand or RealDeal and fails closed", async () => {
  const providerContextSource = await readFile(
    path.join(sourceRoot, "providers", "context.tsx"),
    "utf8",
  );

  assert.match(providerContextSource, /createDemoProviders/);
  assert.match(providerContextSource, /createRealProviders/);
  assert.match(providerContextSource, /configuredMode === 'realdeal'/);
  assert.match(providerContextSource, /return 'demoland'/);
});

test("both build modes are explicit and use the same application entry point", async () => {
  const packageJson = JSON.parse(
    await readFile(path.join(projectRoot, "package.json"), "utf8"),
  );
  const applicationSource = await readFile(
    path.join(sourceRoot, "App.tsx"),
    "utf8",
  );

  assert.match(packageJson.scripts["build:demo"], /--mode demoland/);
  assert.match(packageJson.scripts["build:real"], /--mode realdeal/);
  assert.match(applicationSource, /<ProvidersProvider>/);
  assert.match(applicationSource, /lazy\(\(\) =>/);
  assert.match(applicationSource, /<Suspense/);
  assert.doesNotMatch(applicationSource, /demoland|realdeal/i);
});

test("the shared banner truth-labels both evidence environments", async () => {
  const bannerSource = await readFile(
    path.join(sourceRoot, "components", "DemoModeBanner.tsx"),
    "utf8",
  );

  assert.match(bannerSource, /DEMOLAND/);
  assert.match(bannerSource, /placeholders, mocks, and simulated evidence/i);
  assert.match(bannerSource, /no external effects/i);
  assert.match(bannerSource, /REALDEAL TEST ENVIRONMENT/);
  assert.match(bannerSource, /approved test services and real infrastructure/i);
  assert.match(bannerSource, /no production insurance or live money/i);
});

test("custom environment builds use React's production runtime", async () => {
  const viteConfiguration = await readFile(
    path.join(projectRoot, "vite.config.ts"),
    "utf8",
  );

  assert.match(viteConfiguration, /command === 'build'/);
  assert.doesNotMatch(viteConfiguration, /mode === 'production'/);
});

test("the guided public entry keeps DemoLand boundaries explicit", async () => {
  const applicationSource = await readFile(
    path.join(sourceRoot, "App.tsx"),
    "utf8",
  );
  const tourSource = await readFile(
    path.join(sourceRoot, "pages", "tour", "index.tsx"),
    "utf8",
  );

  assert.match(applicationSource, /path="\/tour"/);
  assert.match(tourSource, /No quote or policy/);
  assert.match(tourSource, /No payment or wallet/);
  assert.match(tourSource, /No submitted personal data/);
  assert.match(tourSource, /does not currently offer, sell, quote, bind, or guarantee/);
  assert.doesNotMatch(tourSource, /providers\/(?:demoland|realdeal)/);
});
