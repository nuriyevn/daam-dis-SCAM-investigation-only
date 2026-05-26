# Smart Contract Sketch

Interface-level design for on-chain components. PoC default: **mock ledger** implementing the same interface. Phase 2: Solidity on EVM testnet (chain TBD).

No production Solidity in repository at documentation time.

## Contract set

| Contract | Purpose |
|----------|---------|
| `OutcomeEscrow` | Hold buyer funds per Intent; release on COR finality |
| `CORRegistry` | Store COR bundle hashes and signer addresses |
| `StakeManager` | Lock and slash executor stake |
| `DisputePool` | Receive slashed stake |
| `CredentialAnchor` | Optional: anchor soulbound events |

## OutcomeEscrow

### State

```solidity
struct Escrow {
    bytes32 intentId;
    address buyer;
    address executor;
    uint256 amount;
    uint256 released;
    EscrowStatus status;
}
enum EscrowStatus { Locked, PartialReleased, Released, Refunded, Disputed }
```

### Functions (interface)

| Function | Caller | Description |
|----------|--------|-------------|
| `createEscrow(intentId, executor, amount)` | Marketplace | Lock buyer deposit |
| `release(intentId, corHash)` | Marketplace | Full release after CORRegistry confirms |
| `releaseMilestone(intentId, amount, corHash)` | Marketplace | Partial release |
| `refund(intentId)` | Marketplace | Expired or dispute refund |
| `markDisputed(intentId)` | Marketplace | Freeze releases |

### Events

- `EscrowCreated(intentId, buyer, executor, amount)`
- `EscrowReleased(intentId, corHash, amount)`
- `EscrowRefunded(intentId)`

## CORRegistry

### State

```solidity
struct CORRecord {
    bytes32 intentId;
    bytes32 corBundleHash;
    bytes32 outputHash;
    address executor;
    address[] signers;
    bool finalized;
}
```

### Functions

| Function | Caller | Description |
|----------|--------|-------------|
| `registerCOR(intentId, corBundleHash, outputHash, signers)` | Marketplace | After off-chain quorum validation |
| `isFinalized(intentId)` | View | Escrow checks before release |
| `getCOR(intentId)` | View | Audit |

### Events

- `CORRegistered(intentId, corBundleHash, outputHash)`
- `CORFinalized(intentId)`

## StakeManager

### Functions

| Function | Caller | Description |
|----------|--------|-------------|
| `lockStake(bidId, executor, amount)` | Marketplace | On bid accept |
| `releaseStake(bidId)` | Marketplace | Successful completion |
| `slash(bidId, amount, reason)` | Marketplace | Failed attestation / abandonment |

### Events

- `StakeLocked(bidId, executor, amount)`
- `StakedSlashed(bidId, amount, reason)`

## DisputePool

- `receiveSlash()` — Accepts slashed tokens
- Governance withdrawal deferred to phase 4

## Marketplace coordinator (off-chain primary)

The PoC **Marketplace** service (not necessarily a single on-chain contract) orchestrates:

1. Validate COR quorum off-chain
2. Call `CORRegistry.registerCOR`
3. Call `OutcomeEscrow.release`
4. Call `StakeManager.releaseStake`

This pattern keeps verification logic upgradable without redeploying escrow.

## Mock ledger adapter (PoC)

Implement interface in application code:

```typescript
interface LedgerAdapter {
  createEscrow(intentId: string, executor: string, amount: string): Promise<string>;
  lockStake(bidId: string, executor: string, amount: string): Promise<void>;
  registerCOR(intentId: string, corBundleHash: string, outputHash: string, signers: string[]): Promise<void>;
  releaseEscrow(intentId: string, corHash: string): Promise<void>;
  slashStake(bidId: string, amount: string): Promise<void>;
  refundEscrow(intentId: string): Promise<void>;
}
```

SQLite table or in-memory map backing balances is sufficient for phase 1.

## Security notes

- Marketplace contract address is sole caller for release/slash (owned by multisig in production)
- Reentrancy guards on `release` and `refund`
- `intentId` uniqueness enforced
- No arbitrary token calls (use allowlisted ERC-20 in phase 2)

See [09-security-trust-and-compliance.md](../09-security-trust-and-compliance.md).

## Related documents

- [11-domain-model.md](11-domain-model.md)
- [14-poc-implementation-guide.md](14-poc-implementation-guide.md)
- [08-poc-scope-and-roadmap.md](../08-poc-scope-and-roadmap.md)
