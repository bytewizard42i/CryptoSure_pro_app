import Image from "next/image";

import {
  CoverageTierExplorer,
  DemoInterestForm,
  DemoLandBanner,
  PartnershipExplorer,
} from "./demo-experience";

const customerCoverage = [
  {
    number: "01",
    title: "Verified wallet compromise",
    copy: "Coverage designed around defined, provable loss events, not vague promises or market performance.",
  },
  {
    number: "02",
    title: "Certified device loss",
    copy: "A clear path for documented device loss or destruction when recovery genuinely is not possible.",
  },
  {
    number: "03",
    title: "Recovery plan failure",
    copy: "Protection for qualifying external failures when a certified recovery plan was followed correctly.",
  },
];

const providerTypes = [
  "Underwriting teams",
  "Insurers and reinsurers",
  "Reserve capital partners",
  "Wallet and platform partners",
];

const protocolSteps = [
  {
    number: "01",
    title: "Prove the risk",
    copy: "Customers prove eligibility and risk bands without exposing their full identity or wallet history.",
  },
  {
    number: "02",
    title: "Lock the promise",
    copy: "Every policy binds to a precise, versioned scope so both sides know exactly what is covered.",
  },
  {
    number: "03",
    title: "Verify the event",
    copy: "Claims combine zero-knowledge proofs with selective disclosure to approved adjusters and recovery partners.",
  },
  {
    number: "04",
    title: "Settle transparently",
    copy: "Approved payouts release from a visible reserve pool while claimant details remain private.",
  },
];

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function resolveProductApplicationUrl(): string | null {
  const configuredProductApplicationUrl =
    process.env.NEXT_PUBLIC_CRYPTOSURE_APP_URL?.trim();
  const isDevelopmentEnvironment = process.env.NODE_ENV !== "production";
  const candidateUrl =
    configuredProductApplicationUrl ||
    (isDevelopmentEnvironment ? "http://127.0.0.1:3014/login" : null);

  if (!candidateUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(candidateUrl);
    const isSecureDestination = parsedUrl.protocol === "https:";
    const isLocalDevelopmentDestination =
      isDevelopmentEnvironment &&
      parsedUrl.protocol === "http:" &&
      (parsedUrl.hostname === "127.0.0.1" ||
        parsedUrl.hostname === "localhost");

    // A deployed public site must never advertise an insecure or malformed
    // product destination. Plain HTTP is accepted only for the local preview.
    if (!isSecureDestination && !isLocalDevelopmentDestination) {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    // Invalid configuration fails closed by hiding the product doorway.
    return null;
  }
}

export default function Home() {
  const productApplicationUrl = resolveProductApplicationUrl();

  return (
    <main>
      <a className="skip-link" href="#top">
        Skip to main content
      </a>
      <DemoLandBanner />
      <div className="background-media" aria-hidden="true">
        <Image
          className="background-ad-image"
          src="/cryptosure-pro-ad-2.png"
          alt=""
          width={1122}
          height={1402}
          priority
          sizes="(max-width: 640px) 100vw, 58vw"
        />
        <div className="background-wash" />
        <div className="background-grid" />
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="CryptoSure home">
          <span className="wordmark-mark">C</span>
          <span>CryptoSure</span>
          <span className="domain-tag">.pro</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#customers">For customers</a>
          <a href="#providers">For providers</a>
          <a href="#protocol">How it works</a>
        </nav>

        <div className="header-actions">
          {productApplicationUrl && (
            <a
              className="header-preview-action"
              href={productApplicationUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open DemoLand
            </a>
          )}
          <a className="header-action" href="#choose-your-path">
            Explore <ArrowIcon />
          </a>
        </div>
      </header>

      <section className="hero" id="top" tabIndex={-1}>
        <div className="hero-copy">
          <div className="eyebrow reveal-item">
            <span className="status-dot" />
            CryptoSure.pro · Privacy-first insurance concept
          </div>

          <h1 className="reveal-item reveal-delay-1">
            Private inputs.
            <span>Verifiable outcomes.</span>
          </h1>

          <p className="hero-description reveal-item reveal-delay-2">
            Explore a proposed insurance experience for crypto wallets and
            digital assets, designed to make scope, exclusions, and evidence
            clearer while revealing the minimum necessary information.
          </p>

          <div className="hero-actions reveal-item reveal-delay-2">
            <a className="hero-action-primary" href="#choose-your-path">
              Explore proposed protection <ArrowIcon />
            </a>
            {productApplicationUrl && (
              <a
                className="hero-action-secondary"
                href={productApplicationUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open DemoLand <ArrowIcon />
              </a>
            )}
          </div>

          <ul
            className="user-first-guardrails reveal-item reveal-delay-3"
            aria-label="CryptoSure exploration safeguards"
          >
            <li>
              <span aria-hidden="true">01</span>
              <strong>No wallet connection</strong>
              <small>Explore before sharing account or asset information.</small>
            </li>
            <li>
              <span aria-hidden="true">02</span>
              <strong>Exclusions before pricing</strong>
              <small>Understand the boundary before considering a tier.</small>
            </li>
            <li>
              <span aria-hidden="true">03</span>
              <strong>Minimum proof only</strong>
              <small>Share only the fact an authorized decision requires.</small>
            </li>
          </ul>
        </div>

        <a
          className="scroll-cue"
          href="#choose-your-path"
          aria-label="Scroll to choose your CryptoSure path"
        >
          <span>Choose your path</span>
          <span className="scroll-line" />
        </a>
      </section>

      <section
        className="decision-section content-section"
        id="choose-your-path"
        aria-labelledby="choose-your-path-heading"
      >
        <div className="decision-heading">
          <div>
            <div className="section-kicker">Start with your goal</div>
            <h2 id="choose-your-path-heading">What brought you to CryptoSure?</h2>
          </div>
          <p>
            Explore the protection concept anonymously, or see how underwriting,
            capital, distribution, and recovery partners could help build it.
          </p>
        </div>

        <div className="path-chooser" aria-label="Choose your CryptoSure path">
          <section
            className="path-button path-button-primary"
            aria-labelledby="customer-protection-path"
          >
            <span className="path-card-topline">
              <span className="path-index">01</span>
              <span>For people and businesses</span>
            </span>
            <span className="path-message">
              <span className="path-intent">“I want”</span>
              <strong
                className="path-product-title"
                id="customer-protection-path"
              >
                Crypto insurance
              </strong>
            </span>
            <span className="path-arrow" aria-hidden="true">
              <ArrowIcon />
            </span>
            <nav
              className="path-category-list"
              aria-label="Choose who needs crypto protection"
            >
              <a className="path-category-link" href="#customers">
                <span className="path-category-number">01</span>
                <span>
                  <strong>Personal</strong>
                  <small>For me or my family</small>
                </span>
                <ArrowIcon />
              </a>
              <a className="path-category-link" href="#customers">
                <span className="path-category-number">02</span>
                <span>
                  <strong>Business</strong>
                  <small>For my business&apos;s crypto assets</small>
                </span>
                <ArrowIcon />
              </a>
              <a className="path-category-link" href="#customers">
                <span className="path-category-number">03</span>
                <span>
                  <strong>Crypto business</strong>
                  <small>For my customers&apos; crypto assets</small>
                </span>
                <ArrowIcon />
              </a>
            </nav>
          </section>
          <section
            className="path-button path-button-secondary"
            aria-labelledby="provider-insurance-path"
          >
            <span className="path-card-topline">
              <span className="path-index">02</span>
              <span>For insurers and protection partners</span>
            </span>
            <span className="path-message">
              <span className="path-intent">“I want”</span>
              <strong
                className="path-product-title"
                id="provider-insurance-path"
              >
                Provide crypto insurance
              </strong>
            </span>
            <span className="path-arrow" aria-hidden="true">
              <ArrowIcon />
            </span>
            <nav
              className="path-category-list"
              aria-label="Choose how to help provide crypto insurance"
            >
              <a className="path-category-link" href="#providers">
                <span className="path-category-number">01</span>
                <span>
                  <strong>Underwriting</strong>
                  <small>Design terms, assess risk, or manage claims</small>
                </span>
                <ArrowIcon />
              </a>
              <a className="path-category-link" href="#providers">
                <span className="path-category-number">02</span>
                <span>
                  <strong>Insurance capacity</strong>
                  <small>Carrier, reinsurance, or reserve capital</small>
                </span>
                <ArrowIcon />
              </a>
              <a className="path-category-link" href="#partner-paths">
                <span className="path-category-number">03</span>
                <span>
                  <strong>Distribution &amp; recovery</strong>
                  <small>Wallet, platform, broker, or forensic partner</small>
                </span>
                <ArrowIcon />
              </a>
            </nav>
          </section>
        </div>
      </section>

      <section className="principles content-section" id="principles">
        <div className="section-kicker">Why CryptoSure</div>
        <div className="principle-intro">
          <h2>Insurance should create confidence, not a new data liability.</h2>
          <p>
            CryptoSure is being built around narrow coverage, verifiable terms,
            private underwriting, and transparent reserves.
          </p>
        </div>

        <div className="principle-grid">
          <article>
            <span>Private by design</span>
            <h3>Prove eligibility, not identity.</h3>
            <p>
              Share the minimum fact required for underwriting, without handing
              over a complete financial biography.
            </p>
          </article>
          <article>
            <span>Honest by construction</span>
            <h3>Know the scope before the claim.</h3>
            <p>
              Policy terms are versioned and cryptographically bound, making the
              promise clear from the beginning.
            </p>
          </article>
          <article>
            <span>Visible where it counts</span>
            <h3>See the capacity, shield the people.</h3>
            <p>
              Reserve capacity and policy status can be auditable while customer
              identities, balances, and evidence remain protected.
            </p>
          </article>
        </div>
      </section>

      <section className="customer-section content-section" id="customers">
        <div className="section-heading split-heading">
          <div>
            <div className="section-kicker">For people and businesses</div>
            <h2>Your assets move differently. Your protection should too.</h2>
          </div>
          <p>
            CryptoSure.app will be the dedicated policy experience. CryptoSure.pro
            is where customers, businesses, and partners discover the protocol and
            join the launch journey.
          </p>
        </div>

        <div className="coverage-list">
          {customerCoverage.map((coverage) => (
            <article key={coverage.number}>
              <span className="list-number">{coverage.number}</span>
              <h3>{coverage.title}</h3>
              <p>{coverage.copy}</p>
              <span className="list-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>

        <CoverageTierExplorer />

        <div className="customer-cta glass-panel">
          <div>
            <span className="panel-label">Customer path</span>
            <h3>Be first to know when coverage opens.</h3>
          </div>
          <a href="#demo-interest">Follow the launch <ArrowIcon /></a>
        </div>
      </section>

      <section className="provider-section content-section" id="providers">
        <div className="provider-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="provider-core">
            <span>Shared</span>
            <strong>Capacity</strong>
          </div>
        </div>

        <div className="provider-copy">
          <div className="section-kicker">For risk and capital partners</div>
          <h2>A programmable insurance layer for the digital asset economy.</h2>
          <p>
            Bring underwriting expertise, reserve capital, distribution, or
            recovery infrastructure into a protocol designed for verifiable risk
            and privacy-preserving coordination.
          </p>

          <ul>
            {providerTypes.map((providerType) => (
              <li key={providerType}>
                <span aria-hidden="true">+</span>
                {providerType}
              </li>
            ))}
          </ul>

          <a className="text-action" href="#demo-interest">
            Explore a protocol partnership <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="partnership-section content-section" id="partner-paths">
        <div className="section-heading split-heading">
          <div>
            <div className="section-kicker">Choose a partnership path</div>
            <h2>Different expertise. One accountable program.</h2>
          </div>
          <p>
            DemoLand shows how regulated capacity, underwriting, distribution,
            privacy technology, and forensic recovery can coordinate without
            pretending that one organization performs every role.
          </p>
        </div>
        <PartnershipExplorer />
      </section>

      <section className="protocol-section content-section" id="protocol">
        <div className="section-heading split-heading">
          <div>
            <div className="section-kicker">A clearer insurance loop</div>
            <h2>Private inputs. Verifiable outcomes.</h2>
          </div>
          <p>
            One shared protocol connects policyholders, underwriters, adjusters,
            reserve partners, and forensic recovery teams.
          </p>
        </div>

        <div className="protocol-steps">
          {protocolSteps.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="faq-section content-section" id="questions">
        <div className="section-heading split-heading">
          <div>
            <div className="section-kicker">Straight answers</div>
            <h2>Built to make the promise understandable.</h2>
          </div>
          <p>
            Insurance earns trust when customers can understand the boundaries
            before they ever need to file a claim.
          </p>
        </div>

        <div className="faq-list">
          <details>
            <summary>
              <span>Is CryptoSure selling insurance today?</span>
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              No. This is a DemoLand product experience. Live coverage requires a
              licensed carrier, approved policy terms and rates, compliant
              distribution, and regulatory authorization in each launch market.
            </p>
          </details>
          <details>
            <summary>
              <span>What would the first policy actually cover?</span>
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              The recommended starting scope is narrow: verified unauthorized wallet
              compromise, with certified device theft or destruction considered only
              after carrier review. Voluntary transfers, market losses, malicious
              approvals, and third-party protocol failures remain excluded at launch.
            </p>
          </details>
          <details>
            <summary>
              <span>Does zero knowledge mean anonymous insurance?</span>
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              No. Zero-knowledge proofs can minimize routine disclosure, but insurers
              still need compliant identity, sanctions, fraud, underwriting, and claims
              processes. CryptoSure is designed to reveal the minimum necessary fact to
              the authorized party at the right moment.
            </p>
          </details>
          <details>
            <summary>
              <span>Who would actually pay an approved claim?</span>
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              A licensed carrier or Lloyd&apos;s-backed insurer should bear the regulated
              insurance risk. CryptoSure supplies the customer experience, privacy,
              evidence, policy orchestration, and recovery coordination around that
              legally accountable carrier relationship.
            </p>
          </details>
          <details>
            <summary>
              <span>What is the difference between CryptoSure.pro and CryptoSure.app?</span>
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              CryptoSure.pro is the public discovery, education, and partnership site.
              CryptoSure.app is reserved for the future authenticated policy experience,
              including enrollment, monitoring, policies, claims, education, and account
              management.
            </p>
          </details>
        </div>
      </section>

      <section className="contact-section content-section" id="demo-interest">
        <div className="contact-glow" aria-hidden="true" />
        <div className="section-kicker">The first conversation starts here</div>
        <h2>Help shape insurance for the ownership economy.</h2>
        <p>
          Whether you want protection, write risk, deploy capital, or distribute
          policies, CryptoSure is opening the table early.
        </p>
        <DemoInterestForm />
      </section>

      <footer>
        <div className="footer-wordmark">
          <span className="wordmark-mark">C</span>
          <span>CryptoSure</span>
        </div>
        <p>
          CryptoSure is a protocol in development. Coverage is not currently
          offered, and all products remain subject to licensing, regulatory
          approval, underwriting terms, and applicable law.
        </p>
        <div className="footer-links">
          <a href="#customers">Customers</a>
          <a href="#providers">Providers</a>
          <a href="https://didz.io">DIDz ecosystem</a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 EnterpriseZK Labs</span>
          <span>CryptoSure.pro · Future policy app: CryptoSure.app</span>
        </div>
      </footer>
    </main>
  );
}
