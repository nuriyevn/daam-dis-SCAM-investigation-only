# PoC Implementation Guide

Practical guide for implementing DAAM-DIS on `backend`, `frontend`, and `codebase` branches.

## Recommended stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| API | Node.js (Fastify) or Go (Chi) | Fast iteration, team familiarity |
| DB | PostgreSQL 16 | Relational lifecycle fits domain |
| ORM | Prisma or sqlc | Migrations for entities in [11-domain-model.md](11-domain-model.md) |
| Frontend | React + Vite + TypeScript | SPA for browse/post/track |
| Artifacts | MinIO or local `./storage` | S3-compatible |
| Ledger | Mock adapter first | Matches [08-poc-scope-and-roadmap.md](../08-poc-scope-and-roadmap.md) |
| CI | GitHub Actions | Lint, test, TS-01 script |

Chain and auth remain **TBD**; wallet auth can wait until phase 2.

## Repository layout (proposed)

```
DAAM-DIS/
├── README.md
├── docs/                          # This documentation set
├── packages/
│   └── shared/                    # Types, COR canonicalization, API client
│       ├── src/
│       │   ├── cor.ts
│       │   ├── output-hash.ts
│       │   └── types.ts
│       └── package.json
├── backend/
│   ├── src/
│   │   ├── api/                   # Route handlers
│   │   ├── modules/
│   │   │   ├── catalog/
│   │   │   ├── intents/
│   │   │   ├── bids/
│   │   │   ├── attestation/
│   │   │   └── credentials/
│   │   ├── ledger/                # MockLedgerAdapter
│   │   └── index.ts
│   ├── prisma/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Catalog.tsx
│   │   │   ├── IntentNew.tsx
│   │   │   ├── IntentDetail.tsx
│   │   │   └── ManifestRegister.tsx
│   │   └── api/
│   └── package.json
└── scripts/
    ├── seed-poc.ts                # Operators, manifests, verifiers
    └── demo-happy-path.ts         # TS-01 automation
```

Align with existing branches: merge `doc` → `backend`/`frontend` when implementation starts.

## Module boundaries (monolith)

Even in one deployable, enforce package boundaries matching [07-architecture.md](../07-architecture.md):

- `catalog` — no imports from `attestation`
- `attestation` — calls `ledger` interface only
- `intents` / `bids` — coordinate via application services, not circular imports

## Mock vs real chain

| Feature | Phase 1 mock | Phase 2 testnet |
|---------|--------------|-----------------|
| Escrow | DB + `MockLedgerAdapter` | `OutcomeEscrow.sol` |
| COR finality | DB flag + mock tx hash | `CORRegistry.sol` |
| Stake | Balance table | `StakeManager.sol` |

Swap adapter via env `LEDGER_MODE=mock|evm`.

## Implementation order

1. **Shared types** — Intent, COR payload, output hash in `packages/shared`
2. **DB schema** — Prisma models from domain doc
3. **Catalog API** — UC-6 manifest registration
4. **Intent + bid API** — UC-1 without attestation
5. **Mock ledger** — lock escrow on accept bid
6. **Artifacts upload** — storage + hash
7. **Attestation** — COR claims, seeded verifiers, quorum
8. **Frontend** — catalog, post Intent, bid list, status
9. **Demo script** — `scripts/demo-happy-path.ts`
10. **Dispute path** — TS-02

## Environment variables (PoC)

```bash
DATABASE_URL=postgresql://...
API_PORT=3000
ARTIFACT_STORAGE_PATH=./storage
LEDGER_MODE=mock
VERIFIER_OPERATOR_IDS=verifier-1,verifier-2,verifier-3
EXECUTOR_SIGNING_KEY=...
VERIFIER_SIGNING_KEYS=...
ADMIN_API_KEY=...
```

## Seeded data

`seed-poc.ts` should create:

- 1 buyer, 2 publishers, 3 verifiers (distinct operators)
- 3 compute manifests (research, code, pod stretch)
- Test balances in mock ledger

## Frontend pages (minimum)

| Page | Actions |
|------|---------|
| Catalog | Search manifests, view credential |
| New Intent | Form for criteria + budget |
| Intent detail | Bids, accept bid, COR status, download artifacts |
| Register manifest | Publisher form |

## Verifier worker

PoC option A: **inline** — attestation module invokes check functions synchronously on signature endpoint.

Option B: **worker process** — polls `/cor-claims/pending`; better for phase 3.

Checks implement criterion `type` handlers in `attestation/checks/`.

## COR canonicalization

Implement once in `packages/shared` and use in API, executor SDK, and verifier worker. Unit tests required for hash stability.

## API documentation

Generate OpenAPI from route definitions or maintain `openapi.yaml` in `codebase` branch; keep in sync with [12-api-contract-sketch.md](12-api-contract-sketch.md).

## Local development

```bash
# Illustrative — adjust when code exists
docker compose up -d postgres minio
cd backend && npm install && npm run migrate && npm run seed
cd backend && npm run dev
cd frontend && npm install && npm run dev
cd backend && npm run demo
```

## Related documents

- [12-api-contract-sketch.md](12-api-contract-sketch.md)
- [15-test-scenarios.md](15-test-scenarios.md)
- [08-poc-scope-and-roadmap.md](../08-poc-scope-and-roadmap.md)
