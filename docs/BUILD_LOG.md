# CryptoSure build log

This file records practical build decisions, visual baselines, and user-interface
preferences that should survive across CryptoSure work sessions.

## July 23, 2026

### Canonical project location

- Work from `/home/js/DIDzMonolith/CryptoSure-me-app`.
- The former Windows-side shell folder was intentionally removed.
- Do not recreate a second CryptoSure checkout under `C:\Users\js\Documents`.

### Browser bookmark and text-size preference

- John fixed the browser bookmarks font-size problem through the browser's own
  text-size settings.
- Preserve the current browser profile, bookmark-label appearance, browser zoom,
  accessibility scaling, and text-size settings during future website testing.
- Do not reset or normalize those browser settings unless John explicitly asks.
- The exact numeric browser setting was not captured. If exact reproduction is
  later required, inspect the active browser profile with John rather than
  guessing or changing it.
- Browser interface text and website content text are separate. Do not change
  CryptoSure typography merely to compensate for a browser-bookmark setting.

### CryptoSure.pro responsive typography baseline

The following values were measured in the freshly built production site with
headless Chrome 145 and reduced-motion mode enabled:

| Viewport | Body | Hero heading | `Crypto insurance` label |
|---|---:|---:|---:|
| Desktop, 1440 × 1000 | 16 px | 128.16 px | 32.4 px |
| Mobile, 390 × 844 | 16 px | 63.18 px | 21.6 px |

Both viewports had no horizontal overflow. The two audience cards measured
approximately half of the available chooser width on desktop and stacked to the
full available width on mobile.

### Accessibility checkpoint

- Added a visible-on-focus `Skip to main content` link.
- Made the hero section a keyboard-focusable skip target.
- Corrected the hero's accessible text so `is a Sure thing` does not collapse
  into `isa Sure thing`.
- Verified the skip link as the first keyboard tab stop and confirmed Enter
  moves focus to the `#top` content target.

### Validation checkpoint

- Public landing page: Vercel build and boundary tests passed.
- Public landing page: Cloudflare-compatible build and rendered HTML tests passed.
- Public landing page: lint and production build passed using Node.js 24.14.0.
- Shared product application: tests, lint, DemoLand build, and RealDeal build passed.
- Production browser inspection at 1440 × 1000 and 390 × 844 reported no console
  errors, failed requests, or horizontal overflow.

### Runtime note

The Cloudflare-compatible build requires a modern Node.js runtime because
`vinext` uses `node:fs/promises.glob`. WSL's default Node.js 20.20.2 is too old.
Use `/home/js/.cache/codex-node-v24.14.0/bin` at the front of `PATH` for complete
landing-page validation.
