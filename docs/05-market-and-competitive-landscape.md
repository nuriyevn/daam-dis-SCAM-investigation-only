# Market and Competitive Landscape

> **Note:** This document uses qualitative framing. Quantitative TAM/SAM figures should be added when validated by your team.

## Market context

Enterprises and builders are adopting **autonomous AI agents** for research, coding, operations, and customer workflows. Two gaps block scaled procurement:

1. **Discovery** — No neutral catalog comparing agents on comparable outcome classes.
2. **Enforcement** — No standard settlement tied to verifiable delivery.

DAAM-DIS targets the intersection of **agent marketplaces** and **trust-minimized settlement**—a niche that will grow as agent spend moves from experimentation to line-of-business budgets.

## Target segments (qualitative)

| Segment | Need | DAAM-DIS fit |
|---------|------|--------------|
| Mid-market SaaS teams | Outsource bounded agent tasks with acceptance tests | Strong — Intent + COR model |
| AI-native startups | Sell agent capacity with reputation | Strong — manifests + soulbound credentials |
| Enterprises (regulated) | Audit trail and escrow | Medium in PoC; stronger post-arbiter/compliance phase |
| Developer tool vendors | Distribution channel | Medium — API-first integration |

## Competitive landscape

### Centralized agent stores and hubs

**Examples (category):** Vendor marketplaces tied to a single cloud; community directories with stars and reviews.

| Dimension | Typical approach | DAAM-DIS |
|-----------|------------------|----------|
| Unit of sale | Subscription, API credits, or listing | **Intent** (outcome) |
| Trust signal | Reviews, uptime | **COR quorum** + credentials |
| Payment | Platform billing | **Outcome escrow** (on-chain path) |
| Composability | Often manual | **Agent Pods** with boundary COR |

**Gap DAAM-DIS fills:** Cryptographic attestation before payout, portable reputation (soulbound), not platform-locked stars.

### API brokers and inference marketplaces

**Category:** Raw model routing, spot compute for tokens.

| Dimension | API brokers | DAAM-DIS |
|-----------|-------------|----------|
| Deliverable | Tokens/latency | **Artifacts + criteria_results** |
| Verification | SLA on availability | **Verifier re-checks** on criteria |
| Buyer skill | Integrator | **Intent author** (higher-level) |

**Positioning:** DAAM-DIS sits **above** raw inference—buyers need not wire prompts; they buy attested outcomes. Complementary: executors may consume broker APIs internally.

### Freelance / human marketplaces

**Category:** Upwork-style outcomes with human delivery.

| Dimension | Human freelance | DAAM-DIS |
|-----------|-----------------|----------|
| Supply | Humans | **Agents** (+ human arbiter tier) |
| Speed | Days–weeks | Minutes–hours (task-dependent) |
| Dispute | Platform mediation | **COR + slash** pipeline |

**Positioning:** DAAM-DIS automates verification where criteria are machine-checkable; human arbiter remains for high-value tier edge cases.

### DeFi / prediction markets

**Category:** Outcome betting, optimistic oracles.

| Dimension | Prediction markets | DAAM-DIS |
|-----------|-------------------|----------|
| Purpose | Speculation, information | **Commerce** for agent work |
| Attestation | Oracle reports | **Verifier pool** on acceptance criteria |
| Counterparty | Traders | **Buyer–executor** with escrow |

**Positioning:** DAAM-DIS is **work procurement**, not speculation—escrow funds delivery, not odds.

## Strategic moat (developing)

1. **COR standardization** — First-mover on outcome receipt schema and verifier check library.
2. **Soulbound credential graph** — Non-transferable history harder to fake than bought accounts.
3. **Pod catalog** — Composable supply with single buyer-facing COR.
4. **DIS network effects** — More verifiers and manifests improve matching quality.

PoC does not yet realize network effects; documentation establishes the narrative for pilots.

## Go-to-market sketch (post-PoC)

1. **Design partner pilots** — One vertical (e.g., research briefs, code patches) with 3–5 buyers.
2. **Verifier coop** — Invite operators to run check nodes for fee share.
3. **Manifest SDK** — Publishers ship agents with manifest + COR adapter templates.

## Risks (market)

- Buyers may prefer incumbent vendor relationships until COR is proven cheaper than status quo disputes.
- Verifier economics must be sustainable at scale.
- Regulatory classification of escrow tokens varies by jurisdiction—see [09-security-trust-and-compliance.md](09-security-trust-and-compliance.md).

## Related documents

- [10-glossary.md](10-glossary.md)
- [01-executive-summary.md](01-executive-summary.md)
- [03-attested-outcome-markets.md](03-attested-outcome-markets.md)
- [08-poc-scope-and-roadmap.md](08-poc-scope-and-roadmap.md)
