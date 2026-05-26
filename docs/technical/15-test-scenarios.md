# PoC Test Scenarios

Acceptance criteria and demo scripts for DAAM-DIS PoC. Maps to use cases in [04-personas-and-use-cases.md](../04-personas-and-use-cases.md) and scope in [08-poc-scope-and-roadmap.md](../08-poc-scope-and-roadmap.md).

## Test environment

- Fresh DB seeded via `scripts/seed-poc.ts`
- `LEDGER_MODE=mock`
- API keys: buyer, publisher A/B, verifier 1–3, admin

## TS-01: Happy path (required)

**Maps to:** UC-1

**Preconditions:** Research manifest registered; buyer funded with `DAAM_TEST` in mock ledger.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Buyer `POST /intents` + publish | Status `open` |
| 2 | Publisher A `POST /intents/{id}/bids` | Bid `submitted` |
| 3 | Buyer `POST /intents/{id}/accept-bid` | Intent `in_progress`; escrow `locked`; stake locked |
| 4 | Publisher A uploads artifacts | Artifacts stored; hashes computed |
| 5 | Publisher A `POST /intents/{id}/cor-claims` | COR `pending` |
| 6 | Verifiers 1–2 approve | Quorum met |
| 7 | System finalizes COR | COR `final`; escrow `released` |
| 8 | Buyer downloads artifact | Files match criteria |

**Automation:** `npm run demo` completes steps 1–7 without manual intervention (verifier auto-sign in test mode acceptable).

**Pass:** Intent status `completed`; `amount_released == budget`.

---

## TS-02: Failed attestation and retry (required)

**Maps to:** UC-3

| Step | Action | Expected |
|------|--------|----------|
| 1 | Complete through COR claim with **invalid** output_hash vs artifacts | — |
| 2 | Verifiers reject | COR `rejected` |
| 3 | Executor submits revised COR within retry window | New COR `pending` |
| 4a | Verifiers approve revised COR | Escrow released (pass) |
| 4b | Verifiers reject again; buyer opens dispute | Escrow `disputed` |
| 5 | Admin resolves refund | Buyer refunded; stake slashed |

**Pass (4a or 4b branch):** Document which branch ran; both branches tested before pilot.

---

## TS-03: Manifest catalog (required)

**Maps to:** UC-6

| Step | Action | Expected |
|------|--------|----------|
| 1 | Publisher `POST /manifests` | 201, status `active` |
| 2 | `GET /manifests?tag=research` | Includes new manifest |
| 3 | UI catalog page | Card visible |

**Pass:** Manifest retrievable by ID and search.

---

## TS-04: Escrow without COR does not release (required)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Accept bid (escrow locked) | — |
| 2 | Wait without COR | Escrow remains `locked` |
| 3 | Direct ledger/API release attempt without finalized COR | 409 or rejected |

**Pass:** No release without COR `final` in registry/adapter.

---

## TS-05: Intent expiry refund (recommended)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Create Intent with deadline 1 minute in past (test clock mock) | — |
| 2 | Run expiry job | Status `expired` → `refunded` |

**Pass:** Buyer balance restored.

---

## TS-06: Milestone partial release (optional)

**Maps to:** UC-2

| Step | Action | Expected |
|------|--------|----------|
| 1 | Intent with two milestones in bid | — |
| 2 | First COR milestone | 50% released |
| 3 | Final COR | Remainder released |

**Pass:** `amount_released` increments correctly.

---

## TS-07: Agent Pod boundary COR (stretch)

**Maps to:** UC-4

| Step | Action | Expected |
|------|--------|----------|
| 1 | Bid from pod manifest | Accepted |
| 2 | Single COR from boundary executor | Completes Intent |

**Pass:** Same as TS-01 with pod manifest ID.

---

## TS-08: High-value arbiter (optional)

**Maps to:** UC-5

| Step | Action | Expected |
|------|--------|----------|
| 1 | Intent `tier: high_value` | Requires 3-of-5 verifiers in config |
| 2 | Simulate split verifier votes | Dispute |
| 3 | Admin `POST /disputes/{id}/resolve` | Partial or full per body |

**Pass:** Documented resolution matches request payload.

---

## CI integration

| Test | Command | Gate |
|------|---------|------|
| Unit (output hash, COR canonical) | `npm test` | Required |
| Integration TS-01 | `npm run test:integration` | Required on main |
| TS-02 | `npm run test:dispute` | Required before pilot |
| TS-03–04 | Included in integration suite | Required |

## Demo script narrative (stakeholder-facing)

1. Show catalog with two competing research agents.
2. Post “Q2 competitor landscape” Intent.
3. Compare bids (price, credential score, stake).
4. Accept bid — funds locked (test tokens).
5. Fast-forward execution (pre-staged artifacts in demo).
6. Show verifier checks passing.
7. COR finalized — escrow released.
8. Download PDF deliverable.

Duration target: **under 5 minutes** live; **under 60 seconds** automated.

## Related documents

- [12-api-contract-sketch.md](12-api-contract-sketch.md)
- [14-poc-implementation-guide.md](14-poc-implementation-guide.md)
- [04-personas-and-use-cases.md](../04-personas-and-use-cases.md)
