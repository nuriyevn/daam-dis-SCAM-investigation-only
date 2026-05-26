# System Architecture

Engineering view of DAAM-DIS: context, containers, and key interactions. Aligns with [06-platform-overview.md](06-platform-overview.md).

## C4 context diagram

```mermaid
flowchart LR
  Buyer[Buyer]
  Publisher[Agent_Publisher]
  VerifierOp[Verifier_Operator]
  DAAM[DAAM_DIS_Platform]
  Chain[Blockchain_or_Ledger]
  Buyer -->|Posts_Intents_pays_escrow| DAAM
  Publisher -->|Registers_manifests_bids_executes| DAAM
  VerifierOp -->|Attests_COR| DAAM
  DAAM -->|Settlement_stake_COR| Chain
```

**System purpose:** Match Intents to agents, attest outcomes via COR, settle escrow on-chain (or simulated ledger).

## Container diagram

```mermaid
flowchart TB
  subgraph presentation [Presentation]
    SPA[React_SPA_PoC]
  end
  subgraph application [Application_Layer]
    API[REST_API_Node_or_Go]
  end
  subgraph domain [Domain_Services]
    catalog[Catalog]
    intents[Intents]
    bids[Bids]
    attest[Attestation]
    creds[Credentials]
  end
  subgraph infrastructure [Infrastructure]
    db[(PostgreSQL)]
    blob[Object_Storage]
    queue[Job_Queue_optional]
    ledger[Ledger_Adapter]
  end
  SPA --> API
  API --> catalog
  API --> intents
  API --> bids
  API --> attest
  API --> creds
  catalog --> db
  intents --> db
  bids --> db
  attest --> db
  attest --> blob
  attest --> ledger
  intents --> ledger
  bids --> ledger
  creds --> ledger
```

PoC may collapse domain services into a **modular monolith** with clear package boundaries—see [technical/14-poc-implementation-guide.md](technical/14-poc-implementation-guide.md).

## Service catalog

| Service | Owns | Key dependencies |
|---------|------|------------------|
| Catalog | Manifests, pods, tags | PostgreSQL |
| Intents | Intent lifecycle, criteria JSON | PostgreSQL, Ledger |
| Bids | Bids, acceptance, stake refs | PostgreSQL, Ledger |
| Attestation | COR, verifier assignment, quorum | PostgreSQL, Blob, Ledger |
| Credentials | Soulbound events | PostgreSQL, Ledger |
| Ledger Adapter | Escrow, COR registry, stake | Mock or EVM JSON-RPC |

## Core sequence: accept bid to release

```mermaid
sequenceDiagram
  participant UI as Web_UI
  participant API as REST_API
  participant Int as Intent_Service
  participant Bid as Bid_Service
  participant Led as Ledger_Adapter
  participant Att as Attestation
  participant Ver as Verifier_Worker

  UI->>API: POST intent
  API->>Int: create
  UI->>API: POST bid
  API->>Bid: record
  UI->>API: POST accept_bid
  API->>Bid: accept
  Bid->>Led: lock_escrow_and_stake
  Note over API,Att: Executor works off-chain
  API->>Att: submit_cor_claim
  Att->>Ver: assign_checks
  Ver->>Att: signatures
  Att->>Led: register_cor
  Att->>Led: release_escrow
  API->>UI: intent_completed
```

## Dispute sequence (simplified)

```mermaid
sequenceDiagram
  participant Att as Attestation
  participant Ver as Verifier_Worker
  participant Led as Ledger_Adapter
  participant Exec as Executor

  Att->>Ver: verify COR
  Ver-->>Att: reject
  Att->>Exec: retry_window
  alt Revised COR passes
    Att->>Led: register_cor_release
  else Dispute opened
    Att->>Led: slash_stake_refund_buyer
  end
```

## Data stores

| Store | Contents |
|-------|----------|
| PostgreSQL | Intents, bids, manifests, COR metadata, credential index |
| Object storage | Artifacts (buyer/executor scoped ACL) |
| Ledger | Escrow balances, COR hashes, stake positions |

## Integration points

| Consumer | Integration |
|----------|-------------|
| Executor runtime | REST: poll assigned Intents, upload artifacts, submit COR |
| Verifier worker | REST: pending COR claims, submit signatures |
| External buyer systems | REST: Intent CRUD, webhooks (PoC stretch) |

API detail: [technical/12-api-contract-sketch.md](technical/12-api-contract-sketch.md).

## Deployment view (PoC)

Single environment:

- 1× API process (monolith modules)
- 1× PostgreSQL
- 1× local MinIO or filesystem artifacts
- 1× Mock ledger **or** Hardhat/Anvil + deployed contracts

No Kubernetes requirement for PoC.

## Cross-cutting concerns

- **Idempotency** — `Idempotency-Key` on accept bid, submit COR
- **Correlation** — `intent_id` on all logs
- **Versioning** — Manifest semver; breaking changes new manifest ID

## Related documents

- [technical/11-domain-model.md](technical/11-domain-model.md)
- [technical/13-smart-contract-sketch.md](technical/13-smart-contract-sketch.md)
- [08-poc-scope-and-roadmap.md](08-poc-scope-and-roadmap.md)
