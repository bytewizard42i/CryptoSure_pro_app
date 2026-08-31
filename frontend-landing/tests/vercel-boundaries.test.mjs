import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function readProjectFile(relativePath) {
  return readFile(new URL(relativePath, projectRoot), "utf8");
}

test("keeps Vercel primary while preserving the Cloudflare Sites build", async () => {
  const packageJson = JSON.parse(await readProjectFile("package.json"));

  assert.equal(packageJson.scripts.dev, "next dev");
  assert.equal(packageJson.scripts.build, "next build");
  assert.match(packageJson.scripts["dev:sites"], /\bvinext dev\b/);
  assert.match(packageJson.scripts["build:sites"], /\bvinext build\b/);
});

test("keeps public persistence disabled until a reviewed data plan exists", async () => {
  const hostingConfiguration = JSON.parse(
    await readProjectFile(".openai/hosting.json"),
  );

  assert.equal(hostingConfiguration.d1, null);
  assert.equal(hostingConfiguration.r2, null);
});

test("declares the Cloudflare-compatible public security perimeter", async () => {
  const nextConfiguration = await readProjectFile("next.config.ts");

  assert.match(nextConfiguration, /Content-Security-Policy/);
  assert.match(nextConfiguration, /https:\/\/api\.cryptosure\.pro/);
  assert.match(nextConfiguration, /https:\/\/challenges\.cloudflare\.com/);
  assert.match(nextConfiguration, /frame-ancestors 'none'/);
  assert.match(nextConfiguration, /X-Content-Type-Options/);
  assert.match(nextConfiguration, /poweredByHeader:\s*false/);
});

test("fails closed when the product application destination is not approved", async () => {
  const landingPageSource = await readProjectFile("app/page.tsx");

  assert.match(landingPageSource, /NEXT_PUBLIC_CRYPTOSURE_APP_URL/);
  assert.match(landingPageSource, /parsedUrl\.protocol === "https:"/);
  assert.match(landingPageSource, /127\.0\.0\.1/);
  assert.match(landingPageSource, /Invalid configuration fails closed/);
  assert.match(landingPageSource, /searchParams\.set\("dest", destination\)/);
  assert.match(landingPageSource, /resolveProductApplicationUrl\("customer", "dashboard"\)/);
  assert.match(landingPageSource, /resolveProductApplicationUrl\("provider", "pool"\)/);
  assert.doesNotMatch(landingPageSource, /<iframe/i);
});

test("maps all eight landing buttons to direct DemoLand destinations", async () => {
  const landingPageSource = await readProjectFile("app/page.tsx");

  assert.match(landingPageSource, /customerDashboardUrl/);
  assert.match(landingPageSource, /customerOnboardingUrl/);
  assert.match(landingPageSource, /customerPoliciesUrl/);
  assert.match(landingPageSource, /providerPoolUrl/);
  assert.match(landingPageSource, /providerPoliciesUrl/);
  assert.match(landingPageSource, /providerClaimsUrl/);
  assert.match(landingPageSource, /\/enter/);
});

test("keeps excluded risk scenarios explicit before price selection", async () => {
  const experienceSource = await readProjectFile("app/demo-experience.tsx");

  assert.match(experienceSource, /Currently excluded/);
  assert.match(experienceSource, /Not an insurable launch event/);
  assert.match(experienceSource, /Voluntary signing/);
  assert.match(experienceSource, /Market movement/);
  assert.match(experienceSource, /aria-live/);
});
