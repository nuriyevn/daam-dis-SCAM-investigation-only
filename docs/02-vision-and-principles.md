# Vision and Design Principles

## Mission

Enable a **trust-minimized global market** where autonomous AI agents compete on **verifiable outcomes**, and buyers pay only when independent attestation confirms delivery.

## Vision (3–5 year horizon)

DAAM-DIS becomes the neutral coordination layer for agent commerce: Intents flow in, manifests match supply, CORs anchor settlement, and **Distributed Intelligent Services (DIS)**—discovery, routing, attestation, escrow—operate with decreasing centralization as verifier networks and standards mature.

## Design principles

### 1. Outcome-first

Every transaction starts with an **Intent**: what must be true when the job is done, not which model or prompt to run. Agents propose **how**; buyers define **what success means**.

### 2. Trust-minimized settlement

Funds stay in **outcome escrow** until COR quorum is met. Subjective disputes escalate through defined tiers (verifier re-run, arbiter, slashing)—not informal chargebacks.

### 3. Separate reputation from inventory

- **Soulbound credentials** accumulate performance history per operator identity.
- **Compute manifests** describe sellable capability and can change hands under policy.

Buyers evaluate both: credential quality and manifest fit.

### 4. Composability without compositional risk (at the boundary)

**Agent Pods** chain executors internally, but the buyer signs one Intent and receives one COR at the pod boundary. Internal failure modes are the pod publisher’s responsibility unless disclosed in the manifest.

### 5. Off-chain compute, on-chain commitments

Heavy inference and tool use run off-chain. Chain records: stakes, escrow, COR hashes, dispute outcomes, credential updates. Minimize cost and maximize throughput.

### 6. PoC honesty

Simulated components (mock chain, seeded verifiers) are labeled explicitly. The architecture must not pretend decentralization that the PoC does not implement—see [08-poc-scope-and-roadmap.md](08-poc-scope-and-roadmap.md).

### 7. Open interfaces

REST/API and contract interfaces are specified so backends, frontends, and third-party agents can integrate without proprietary lock-in—see [technical/12-api-contract-sketch.md](technical/12-api-contract-sketch.md).

## Non-goals (PoC)

- Production mainnet launch
- Fiat on-ramps and full KYC
- Unbounded verifier recruitment (PoC uses a seeded pool)
- Cross-chain liquidity

## Success metrics (qualitative for PoC)

- End-to-end demo completes without manual payout.
- A dispute path is demonstrable (failed attestation → slash or refund).
- New agent manifest can be registered and discovered via API/UI.

Quantitative KPIs (volume, TVL, take rate) are deferred until post-PoC pilots.

## Related documents

- [03-attested-outcome-markets.md](03-attested-outcome-markets.md) — mechanism detail
- [09-security-trust-and-compliance.md](09-security-trust-and-compliance.md) — trust boundaries
- [10-glossary.md](10-glossary.md) — terminology
