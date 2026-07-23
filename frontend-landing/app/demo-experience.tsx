"use client";

import { FormEvent, useMemo, useState } from "react";

type CoverageTier = {
  identifier: string;
  coverageLimit: number;
  annualPrice: number;
  monthlyPrice: number;
  deductible: number;
  audience: string;
  securityControls: string[];
};

const coverageTiers: CoverageTier[] = [
  {
    identifier: "essential",
    coverageLimit: 500,
    annualPrice: 49,
    monthlyPrice: 4.99,
    deductible: 50,
    audience: "A simple first layer for a small self-custody wallet.",
    securityControls: [
      "Wallet ownership proof",
      "30-day policy seasoning",
      "Basic CryptoSure-EDU",
      "Insured-address monitoring",
    ],
  },
  {
    identifier: "plus",
    coverageLimit: 1_000,
    annualPrice: 79,
    monthlyPrice: 7.99,
    deductible: 100,
    audience: "Everyday protection for active crypto owners.",
    securityControls: [
      "All Essential controls",
      "Device security attestation",
      "Recovery-plan confirmation",
      "Rapid incident reporting",
    ],
  },
  {
    identifier: "vault",
    coverageLimit: 5_000,
    annualPrice: 299,
    monthlyPrice: 29.99,
    deductible: 250,
    audience: "Hardened protection for a meaningful wallet balance.",
    securityControls: [
      "Hardware wallet required",
      "Signed EDU certification",
      "Approved recovery plan",
      "Continuous risk monitoring",
    ],
  },
  {
    identifier: "vault-plus",
    coverageLimit: 10_000,
    annualPrice: 549,
    monthlyPrice: 54.99,
    deductible: 500,
    audience: "Enhanced controls for higher-value self-custody.",
    securityControls: [
      "All Vault controls",
      "Multisig or equivalent recovery",
      "Enhanced wallet review",
      "Manual claim evidence review",
    ],
  },
];

const partnershipPaths = [
  {
    identifier: "underwriter",
    label: "Underwriter",
    headline: "Write a precisely defined digital-asset risk.",
    explanation:
      "Bring underwriting authority and claims discipline to a program built around narrow events, observable controls, and versioned policy scope.",
    partnerContribution: "Carrier paper, pricing approval, policy forms, claims authority",
    cryptoSureContribution: "Risk telemetry, ZK eligibility proofs, policy orchestration, customer experience",
  },
  {
    identifier: "capital",
    label: "Capacity partner",
    headline: "Back measurable risk with transparent capacity.",
    explanation:
      "Explore regulated reserve, reinsurance, or captive participation after credible exposure and claims data exists.",
    partnerContribution: "Risk capital, reinsurance structure, portfolio constraints",
    cryptoSureContribution: "Cohort data, incident limits, proof-based reporting, recovery coordination",
  },
  {
    identifier: "distribution",
    label: "Distribution",
    headline: "Embed protection where wallet decisions happen.",
    explanation:
      "Wallets, exchanges, employers, and platforms can make clearly scoped protection discoverable at the moment it is useful.",
    partnerContribution: "Trusted customer relationship, compliant distribution, enrollment surface",
    cryptoSureContribution: "Education, eligibility, quote journey, policy and claim interfaces",
  },
  {
    identifier: "recovery",
    label: "Recovery partner",
    headline: "Turn transaction evidence into rapid action.",
    explanation:
      "Combine automated tracing with exchange, law-enforcement, legal, and chain-of-custody workflows when recovery is economically justified.",
    partnerContribution: "Tracing, freeze requests, legal process, recovery reporting",
    cryptoSureContribution: "Incident detection, evidence package, claim linkage, recovery accounting",
  },
];

function formatUnitedStatesDollars(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

const riskScenarios = [
  {
    identifier: "unauthorized-compromise",
    label: "Someone gained unauthorized control",
    status: "Potential launch scope",
    statusTone: "potential",
    explanation:
      "A verified unauthorized wallet compromise is the recommended starting event for carrier review. Eligibility would still depend on policy terms, security controls, evidence, and exclusions.",
  },
  {
    identifier: "device-loss",
    label: "My certified device was stolen or destroyed",
    status: "Carrier review required",
    statusTone: "review",
    explanation:
      "Device theft or destruction may be considered only when recovery is genuinely unavailable and the device, backup, and custody requirements are clearly documented.",
  },
  {
    identifier: "malicious-approval",
    label: "I approved a malicious transaction",
    status: "Currently excluded",
    statusTone: "excluded",
    explanation:
      "Voluntary signing, token approvals, and transfers are outside the recommended launch scope, even when a scam or malicious interface influenced the decision.",
  },
  {
    identifier: "market-loss",
    label: "My token or portfolio lost value",
    status: "Not an insurable launch event",
    statusTone: "excluded",
    explanation:
      "Market movement, token failure, and investment loss are not part of the proposed CryptoSure wallet-compromise protection concept.",
  },
] as const;

export function DemoLandBanner() {
  return (
    <div className="demo-land-banner" role="status">
      <span aria-hidden="true">◆</span>
      <strong>DemoLand</strong>
      <span>Pre-launch simulation. No insurance is offered or sold.</span>
    </div>
  );
}

export function CoverageTierExplorer() {
  const [selectedRiskScenarioIdentifier, setSelectedRiskScenarioIdentifier] =
    useState("unauthorized-compromise");
  const [selectedTierIdentifier, setSelectedTierIdentifier] = useState("plus");
  const [billingCadence, setBillingCadence] = useState<"annual" | "monthly">("annual");

  const selectedRiskScenario =
    riskScenarios.find(
      (riskScenario) =>
        riskScenario.identifier === selectedRiskScenarioIdentifier,
    ) ?? riskScenarios[0];

  const selectedCoverageTier = useMemo(
    () =>
      coverageTiers.find(
        (coverageTier) => coverageTier.identifier === selectedTierIdentifier,
      ) ?? coverageTiers[1],
    [selectedTierIdentifier],
  );

  const displayedPrice =
    billingCadence === "annual"
      ? selectedCoverageTier.annualPrice
      : selectedCoverageTier.monthlyPrice;

  return (
    <div className="tier-explorer" aria-labelledby="tier-explorer-heading">
      <div className="risk-scenario-explorer">
        <div>
          <span className="panel-label">Start with your concern</span>
          <h3>Which event are you trying to protect against?</h3>
          <p>
            Explore the boundary before comparing illustrative limits or
            pricing.
          </p>
        </div>

        <div
          className="risk-scenario-options"
          role="group"
          aria-label="Choose a risk scenario"
        >
          {riskScenarios.map((riskScenario) => {
            const isSelected =
              riskScenario.identifier === selectedRiskScenarioIdentifier;

            return (
              <button
                type="button"
                className={
                  isSelected
                    ? "risk-scenario-option is-selected"
                    : "risk-scenario-option"
                }
                aria-pressed={isSelected}
                onClick={() =>
                  setSelectedRiskScenarioIdentifier(riskScenario.identifier)
                }
                key={riskScenario.identifier}
              >
                {riskScenario.label}
              </button>
            );
          })}
        </div>

        <div
          className={`risk-scenario-result is-${selectedRiskScenario.statusTone}`}
          aria-live="polite"
        >
          <span>{selectedRiskScenario.status}</span>
          <p>{selectedRiskScenario.explanation}</p>
        </div>
      </div>

      <div className="tier-explorer-heading">
        <div>
          <span className="panel-label">Then compare protection concepts</span>
          <h3 id="tier-explorer-heading">
            Choose an illustrative starting tier.
          </h3>
        </div>

        <div className="billing-toggle" aria-label="Choose billing cadence">
          <button
            type="button"
            className={billingCadence === "annual" ? "is-active" : ""}
            aria-pressed={billingCadence === "annual"}
            onClick={() => setBillingCadence("annual")}
          >
            Annual
          </button>
          <button
            type="button"
            className={billingCadence === "monthly" ? "is-active" : ""}
            aria-pressed={billingCadence === "monthly"}
            onClick={() => setBillingCadence("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="tier-options" role="group" aria-label="Illustrative coverage tiers">
        {coverageTiers.map((coverageTier) => {
          const isSelected = coverageTier.identifier === selectedTierIdentifier;

          return (
            <button
              type="button"
              className={isSelected ? "tier-option is-selected" : "tier-option"}
              aria-pressed={isSelected}
              onClick={() => setSelectedTierIdentifier(coverageTier.identifier)}
              key={coverageTier.identifier}
            >
              <span>Coverage</span>
              <strong>{formatUnitedStatesDollars(coverageTier.coverageLimit)}</strong>
              <small>{formatUnitedStatesDollars(coverageTier.annualPrice)} / year</small>
            </button>
          );
        })}
      </div>

      <div className="tier-result" aria-live="polite">
        <div className="tier-price">
          <span>Illustrative price</span>
          <strong>{formatUnitedStatesDollars(displayedPrice)}</strong>
          <small>{billingCadence === "annual" ? "per year" : "per month"}</small>
        </div>

        <div className="tier-summary">
          <span>{formatUnitedStatesDollars(selectedCoverageTier.deductible)} deductible</span>
          <h4>{selectedCoverageTier.audience}</h4>
          <ul>
            {selectedCoverageTier.securityControls.map((securityControl) => (
              <li key={securityControl}>
                <span aria-hidden="true">✓</span>
                {securityControl}
              </li>
            ))}
          </ul>
        </div>

        <a href="#demo-interest" className="tier-result-action">
          Join this tier&apos;s launch list <span aria-hidden="true">↗</span>
        </a>
      </div>

      <p className="demo-pricing-disclosure">
        DemoLand pricing is a product hypothesis for underwriting discussions. It is
        not a quote, binder, policy, or promise of coverage. Final prices and terms
        require carrier, actuarial, legal, and regulatory approval.
      </p>
    </div>
  );
}

export function PartnershipExplorer() {
  const [selectedPartnershipIdentifier, setSelectedPartnershipIdentifier] =
    useState("underwriter");

  const selectedPartnership = useMemo(
    () =>
      partnershipPaths.find(
        (partnershipPath) =>
          partnershipPath.identifier === selectedPartnershipIdentifier,
      ) ?? partnershipPaths[0],
    [selectedPartnershipIdentifier],
  );

  return (
    <div className="partnership-explorer">
      <div className="partnership-tabs" role="tablist" aria-label="Partnership paths">
        {partnershipPaths.map((partnershipPath) => (
          <button
            type="button"
            role="tab"
            id={`partnership-tab-${partnershipPath.identifier}`}
            aria-controls="partnership-panel"
            aria-selected={
              selectedPartnershipIdentifier === partnershipPath.identifier
            }
            className={
              selectedPartnershipIdentifier === partnershipPath.identifier
                ? "is-active"
                : ""
            }
            onClick={() =>
              setSelectedPartnershipIdentifier(partnershipPath.identifier)
            }
            key={partnershipPath.identifier}
          >
            {partnershipPath.label}
          </button>
        ))}
      </div>

      <div
        className="partnership-panel"
        id="partnership-panel"
        role="tabpanel"
        aria-labelledby={`partnership-tab-${selectedPartnership.identifier}`}
        tabIndex={0}
      >
        <span className="panel-label">{selectedPartnership.label} path</span>
        <h3>{selectedPartnership.headline}</h3>
        <p>{selectedPartnership.explanation}</p>

        <dl>
          <div>
            <dt>Partner brings</dt>
            <dd>{selectedPartnership.partnerContribution}</dd>
          </div>
          <div>
            <dt>CryptoSure brings</dt>
            <dd>{selectedPartnership.cryptoSureContribution}</dd>
          </div>
        </dl>

        <a href="#demo-interest">
          Start this conversation <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}

export function DemoInterestForm() {
  const [interestPath, setInterestPath] = useState<"coverage" | "partnership">(
    "coverage",
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleDemoSubmission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // DemoLand intentionally does not transmit or persist the visitor's data. This
    // simulates the final conversion state while keeping the prototype honest.
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div className="demo-form-success" role="status">
        <span aria-hidden="true">✓</span>
        <h3>Demo interest captured.</h3>
        <p>
          This prototype did not transmit or save your information. In RealDeal,
          this handoff will use an approved privacy notice, consent record, and
          secure customer relationship system.
        </p>
        <button type="button" onClick={() => setIsSubmitted(false)}>
          Try the other path
        </button>
      </div>
    );
  }

  return (
    <form className="demo-interest-form" onSubmit={handleDemoSubmission}>
      <div className="interest-path-toggle" aria-label="Choose your interest path">
        <button
          type="button"
          className={interestPath === "coverage" ? "is-active" : ""}
          aria-pressed={interestPath === "coverage"}
          onClick={() => setInterestPath("coverage")}
        >
          I want coverage
        </button>
        <button
          type="button"
          className={interestPath === "partnership" ? "is-active" : ""}
          aria-pressed={interestPath === "partnership"}
          onClick={() => setInterestPath("partnership")}
        >
          I want to provide insurance
        </button>
      </div>

      <div className="form-grid">
        <label>
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>{interestPath === "coverage" ? "Coverage interest" : "Organization"}</span>
          {interestPath === "coverage" ? (
            <select name="coverageTier" defaultValue="1000">
              <option value="500">$500 coverage</option>
              <option value="1000">$1,000 coverage</option>
              <option value="5000">$5,000 coverage</option>
              <option value="10000">$10,000 coverage</option>
            </select>
          ) : (
            <input name="organization" type="text" autoComplete="organization" required />
          )}
        </label>
        <label>
          <span>{interestPath === "coverage" ? "Wallet type" : "Partnership role"}</span>
          <select name="interestRole" defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            {interestPath === "coverage" ? (
              <>
                <option value="hardware">Hardware wallet</option>
                <option value="mobile">Mobile wallet</option>
                <option value="browser">Browser wallet</option>
                <option value="multisig">Multisig wallet</option>
              </>
            ) : (
              <>
                <option value="underwriter">Underwriter or carrier</option>
                <option value="capital">Capacity or reinsurance</option>
                <option value="distribution">Wallet or distribution</option>
                <option value="recovery">Forensics or recovery</option>
              </>
            )}
          </select>
        </label>
      </div>

      <label className="form-message">
        <span>What would make CryptoSure valuable to you?</span>
        <textarea name="message" rows={3} />
      </label>

      <div className="form-submit-row">
        <p>DemoLand only. Nothing entered here leaves this browser.</p>
        <button type="submit">
          Simulate joining the launch <span aria-hidden="true">↗</span>
        </button>
      </div>
    </form>
  );
}
