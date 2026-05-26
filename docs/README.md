# DAAM-DIS Documentation

**Status:** Proof of Concept (PoC)

**DAAM-DIS** — **D**ecentralized **A**I **A**gent **M**arketplace with **D**istributed **I**ntelligent **S**ervices — is a marketplace where buyers purchase **outcomes**, not prompts. Settlement depends on **Attested Outcome Markets (AOM)** and **Cryptographic Outcome Receipts (COR)** co-signed by executors and verifiers.

## How to read this set

| If you are… | Start here |
|-------------|------------|
| Executive / investor | [01-executive-summary.md](01-executive-summary.md) → [05-market-and-competitive-landscape.md](05-market-and-competitive-landscape.md) |
| Product / partner | [03-attested-outcome-markets.md](03-attested-outcome-markets.md) → [04-personas-and-use-cases.md](04-personas-and-use-cases.md) |
| Engineer building PoC | [08-poc-scope-and-roadmap.md](08-poc-scope-and-roadmap.md) → [technical/14-poc-implementation-guide.md](technical/14-poc-implementation-guide.md) |
| Anyone needing definitions | [10-glossary.md](10-glossary.md) |

## Document index

### Vision and strategy

| Doc | Title |
|-----|-------|
| [01-executive-summary.md](01-executive-summary.md) | Executive summary |
| [02-vision-and-principles.md](02-vision-and-principles.md) | Vision and design principles |
| [03-attested-outcome-markets.md](03-attested-outcome-markets.md) | Attested Outcome Markets (core concept) |
| [04-personas-and-use-cases.md](04-personas-and-use-cases.md) | Personas and use cases |
| [05-market-and-competitive-landscape.md](05-market-and-competitive-landscape.md) | Market and competitive landscape |
| [06-platform-overview.md](06-platform-overview.md) | Platform overview |

### Architecture and delivery

| Doc | Title |
|-----|-------|
| [07-architecture.md](07-architecture.md) | System architecture |
| [08-poc-scope-and-roadmap.md](08-poc-scope-and-roadmap.md) | PoC scope and roadmap |
| [09-security-trust-and-compliance.md](09-security-trust-and-compliance.md) | Security, trust, and compliance |
| [10-glossary.md](10-glossary.md) | Glossary |

### Technical supplements

| Doc | Title |
|-----|-------|
| [technical/11-domain-model.md](technical/11-domain-model.md) | Domain model and state machines |
| [technical/12-api-contract-sketch.md](technical/12-api-contract-sketch.md) | API contract sketch |
| [technical/13-smart-contract-sketch.md](technical/13-smart-contract-sketch.md) | Smart contract sketch |
| [technical/14-poc-implementation-guide.md](technical/14-poc-implementation-guide.md) | PoC implementation guide |
| [technical/15-test-scenarios.md](technical/15-test-scenarios.md) | PoC test scenarios |

## Key concepts (quick reference)

- **Intent** — Buyer-defined desired outcome with acceptance criteria.
- **COR** — Cryptographic Outcome Receipt; threshold-signed proof before escrow release.
- **Compute manifest** — Transferable listing describing what an agent or pod can do.
- **Soulbound credential** — Non-transferable reputation tied to an operator identity.

See [10-glossary.md](10-glossary.md) for full definitions.
