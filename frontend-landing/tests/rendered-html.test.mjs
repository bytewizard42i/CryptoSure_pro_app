import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the CryptoSure DemoLand experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>CryptoSure \| Where crypto protection is a Sure thing<\/title>/i);
  assert.match(html, /Where crypto protection is/);
  assert.match(html, /I want/);
  assert.match(html, /Crypto insurance/);
  assert.match(html, /To provide insurance/);
  assert.match(html, /Personal/);
  assert.match(html, /For me or my family/);
  assert.match(html, /Business/);
  assert.match(html, /For my business(?:&#x27;|')s crypto assets/);
  assert.match(html, /Crypto business/);
  assert.match(html, /For my customers(?:&#x27;|') crypto assets/);
  assert.ok(
    (html.match(/“I want”/g) ?? []).length >= 2,
    "both audience buttons should render the same quoted intent",
  );
  assert.match(html, /DemoLand/);
  assert.match(html, /No insurance is offered or sold/);
  assert.match(html, /CryptoSure\.app/);
  assert.match(html, /No wallet connection/);
  assert.match(html, /Exclusions before pricing/);
  assert.match(html, /Minimum proof only/);
  assert.match(
    html,
    /class="skip-link" href="#top">Skip to main content<\/a>/,
  );
  assert.match(
    html,
    /<section class="hero" id="top" tabindex="-1">/,
  );
  assert.doesNotMatch(
    html,
    /Where crypto protection is<\/?[^>]*>a Sure thing/,
    "the accessible hero text must not collapse to 'isa Sure thing'",
  );
  assert.doesNotMatch(html, /Your site is taking shape/);
});

test("renders the four proposed starting limits", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, />\$500</);
  assert.match(html, />\$1,000</);
  assert.match(html, />\$5,000</);
  assert.match(html, />\$10,000</);
  assert.match(html, /product hypothesis for underwriting discussions/);
});

test("shows risk boundaries before illustrative pricing", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /Which event are you trying to protect against/);
  assert.match(html, /Someone gained unauthorized control/);
  assert.match(html, /I approved a malicious transaction/);
  assert.match(html, /My token or portfolio lost value/);
  assert.match(html, /Potential launch scope/);
  assert.match(html, /recommended starting event/);
});
