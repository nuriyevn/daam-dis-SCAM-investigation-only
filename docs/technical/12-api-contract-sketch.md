# API Contract Sketch

REST API for DAAM-DIS PoC. Base path: `/api/v1`. Auth: `Authorization: Bearer <api_key>` with role claims.

OpenAPI generation recommended in `codebase` branch from this spec.

## Conventions

- JSON request/response bodies
- ISO 8601 timestamps (UTC)
- Errors: `{ "error": { "code": "...", "message": "..." } }`
- Pagination: `?page=1&limit=20` → `{ "data": [], "meta": { "total", "page", "limit" } }`
- Idempotency: `Idempotency-Key` header on `POST /intents/{id}/accept-bid`, `POST /cors`

## Resources

### Manifests

| Method | Path | Description |
|--------|------|-------------|
| GET | `/manifests` | List/search (`?tag=research&q=`) |
| GET | `/manifests/{id}` | Get manifest |
| POST | `/manifests` | Create (publisher) |
| PATCH | `/manifests/{id}` | Update draft/active |
| POST | `/pods` | Create pod (publisher) |
| GET | `/pods/{id}` | Get pod |

**POST /manifests** (excerpt)

```json
{
  "title": "Research Agent v1",
  "description": "Competitive landscape reports",
  "capability_tags": ["research", "pdf"],
  "models": ["gpt-4-class"],
  "tools": ["web_search", "citation_extractor"],
  "min_stake": "10.00",
  "pricing_template": { "base": "50.00", "per_page": "5.00" }
}
```

### Credentials

| Method | Path | Description |
|--------|------|-------------|
| GET | `/operators/{id}/credential` | Soulbound credential (read-only) |
| GET | `/operators/me` | Current operator profile |

### Intents

| Method | Path | Description |
|--------|------|-------------|
| GET | `/intents` | List buyer’s Intents |
| POST | `/intents` | Create Intent |
| GET | `/intents/{id}` | Get Intent |
| POST | `/intents/{id}/publish` | `draft` → `open` |
| POST | `/intents/{id}/cancel` | Cancel if no award |

**POST /intents**

```json
{
  "title": "Q2 competitor landscape",
  "outcome_description": "PDF report covering 5 competitors",
  "acceptance_criteria": [
    {
      "id": "crit-1",
      "type": "file_hash",
      "target": "artifact/report.pdf",
      "expected_hash": null
    },
    {
      "id": "crit-2",
      "type": "min_count",
      "field": "citations",
      "minimum": 10
    }
  ],
  "budget": "100.00",
  "currency": "DAAM_TEST",
  "tier": "standard",
  "deadline": "2026-06-01T00:00:00Z"
}
```

### Bids

| Method | Path | Description |
|--------|------|-------------|
| GET | `/intents/{id}/bids` | List bids (buyer) |
| POST | `/intents/{id}/bids` | Submit bid (publisher) |
| POST | `/intents/{id}/accept-bid` | Body: `{ "bid_id": "uuid" }` |
| POST | `/bids/{id}/withdraw` | Withdraw submitted bid |

### Execution and artifacts

| Method | Path | Description |
|--------|------|-------------|
| GET | `/intents/{id}/assignment` | Executor view (assigned operator) |
| POST | `/intents/{id}/artifacts` | Multipart upload |
| GET | `/artifacts/{id}/download` | Signed URL or stream |

### COR and attestation

| Method | Path | Description |
|--------|------|-------------|
| POST | `/intents/{id}/cor-claims` | Executor submits claim |
| GET | `/intents/{id}/cor` | Current COR status |
| GET | `/cor-claims/pending` | Verifier queue |
| POST | `/cor-claims/{id}/signatures` | Verifier approve/reject |

**POST /intents/{id}/cor-claims**

```json
{
  "output_hash": "a1b2c3...",
  "criteria_results": [
    { "criterion_id": "crit-1", "passed": true },
    { "criterion_id": "crit-2", "passed": true }
  ],
  "executor_signature": "hex"
}
```

**POST /cor-claims/{id}/signatures**

```json
{
  "result": "approve",
  "signature": "hex",
  "notes": "All checks passed"
}
```

### Disputes (PoC admin-assisted)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/intents/{id}/disputes` | Open dispute (buyer) |
| POST | `/disputes/{id}/resolve` | Admin/arbiter resolution |

### Ledger (read-only PoC)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/escrows/{id}` | Escrow status |
| GET | `/ledger/balance/{operator_id}` | Test token balance |

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | `{ "status": "ok" }` |

## Webhooks (stretch)

`intent.completed`, `cor.quorum_met`, `cor.rejected` — POST to buyer URL with HMAC signature.

## Status codes

| Code | Usage |
|------|-------|
| 200 | OK |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Wrong role |
| 404 | Not found |
| 409 | Invalid state transition |
| 422 | Criteria not met |

## Role matrix

| Endpoint group | buyer | publisher | verifier | admin |
|----------------|-------|-----------|----------|-------|
| manifests POST | | x | | x |
| intents POST | x | | | |
| bids POST | | x | | |
| accept-bid | x | | | |
| cor-claims POST | | x | | |
| signatures POST | | | x | |
| disputes resolve | | | | x |

## Related documents

- [11-domain-model.md](11-domain-model.md)
- [14-poc-implementation-guide.md](14-poc-implementation-guide.md)
- [15-test-scenarios.md](15-test-scenarios.md)
