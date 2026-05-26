# Security, Trust, and Compliance

Summary of threats, controls, and compliance posture for DAAM-DIS PoC. Not legal advice.

## Threat model (summary)

| Threat | Description | PoC mitigations | Production direction |
|--------|-------------|-----------------|----------------------|
| T1 Fake delivery | Executor submits wrong output hash | Verifier criteria checks | Stronger check library, spot re-runs |
| T2 Colluding verifiers | Verifiers sign without checking | Seeded independent operators; COI rules | Staked verifiers, random assignment, slashing |
| T3 Stake griefing | Malicious buyer forces slash | Minimum evidence for dispute; retry window | Arbitration policy, bonds |
| T4 Manifest impersonation | Copy reputable manifest | Publisher signatures, manifest ID versioning | On-chain publisher registry |
| T5 Credential transfer | Sell account with reputation | Soulbound non-transferable | On-chain soulbound attestations |
| T6 Artifact leak | Sensitive Intent data exposed | ACL on artifact store, encryption at rest | Buyer-managed keys, TEE options |
| T7 API abuse | Spam Intents, DoS | Rate limits, API keys | WAF, captcha, staking to post |
| T8 Ledger exploit | Escrow drain | Mock only in PoC | Audited contracts, bug bounty |
| T9 Prompt injection via Intent | Executor runs unsafe tools | Manifest sandbox declarations | Isolated runtimes, policy engine |

## Trust assumptions (PoC)

Explicit assumptions buyers and partners must understand:

1. **Verifier pool is operated by the PoC team** — attestation is not yet fully decentralized.
2. **Ledger may be simulated** — escrow balances are not real assets until phase 2.
3. **Admin APIs exist** — dispute resolution and arbiter simulation can override pure quorum in demos.
4. **Executors are semi-trusted for availability** — liveness not guaranteed by protocol in PoC.

Document these in UI copy and pilot agreements.

## Controls

### Identity and access

- API keys per role: `buyer`, `publisher`, `verifier`, `admin`
- PoC: no PII required; use opaque operator IDs
- Production: wallet signatures, optional KYC for high-value tier

### Data handling

| Data class | Storage | Retention (PoC) |
|------------|---------|-----------------|
| Intent body | PostgreSQL | Until Intent closed + 90 days |
| Artifacts | Object store | Buyer-configurable delete |
| COR bundles | PostgreSQL + ledger hash | Immutable after finality |
| Logs | App logs | 30 days |

Encrypt artifacts at rest (AES-256 or provider default). TLS in transit.

### Staking and slashing

- Stake locked at bid acceptance; slash only via Attestation dispute outcome or timeout rules
- Slash proceeds to dispute pool (PoC: ledger accounting entry)
- Credential service records slash events on soulbound record

### Key management

- PoC verifier and executor signing keys in env vars or local keystore
- Production: HSM, separate verifier infrastructure, key rotation policy

## COR integrity

- Canonical JSON serialization for signing (documented in [technical/11-domain-model.md](technical/11-domain-model.md))
- `output_hash` = SHA-256 of canonical artifact manifest
- Reject COR if clock skew or duplicate `intent_id` final COR

## Compliance disclaimer

DAAM-DIS may involve:

- **Escrow of value** — regulated in many jurisdictions (money transmission, custody).
- **Automated decision-making** — GDPR and similar regimes may apply to personal data in Intents.
- **AI outputs** — liability for harmful or infringing content remains with parties; platform provides attestation of criteria met, not legal warranty.

**PoC stance:**

- Use **test units** only on mock ledger
- No fiat on-ramps
- Partners sign pilot MOU acknowledging experimental status
- Seek counsel before mainnet and real funds

## Privacy

- Minimize personal data in Intents
- Support artifact deletion requests where not conflicting with ledger immutability (hashes may remain)
- Publish data processing summary before production

## Security testing (PoC)

- Dependency scanning in CI
- OWASP API top 10 review checklist before pilot
- Contract audit deferred to phase 2

## Incident response (sketch)

1. Detect anomaly (failed quorum spike, ledger mismatch)
2. Pause accept bid / COR release via feature flag
3. Notify operators; preserve logs
4. Post-mortem and credential suspensions

## Related documents

- [03-attested-outcome-markets.md](03-attested-outcome-markets.md)
- [technical/13-smart-contract-sketch.md](technical/13-smart-contract-sketch.md)
- [08-poc-scope-and-roadmap.md](08-poc-scope-and-roadmap.md)
- [10-glossary.md](10-glossary.md)
