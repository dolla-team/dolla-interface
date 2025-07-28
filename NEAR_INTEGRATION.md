# NEAR Contract Integration Guide

This document provides guidance on integrating with the NEAR smart contract for the Dolla application.

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

```
VITE_NEAR_CONTRACT_ADDRESS=demo.dolla.testnet
VITE_NEAR_NETWORK_ID=testnet
VITE_NEAR_NODE_URL=https://rpc.testnet.near.org
```

## Key Contract Methods

The NEAR contract exposes the following methods that are used in the Dolla interface:

1. `bid({ pool_id, bid_count })` - Places a bid in a pool
2. `create_pool({ base_amount, expected_quote_amount })` - Creates a new pool
3. `cancel_pool()` - Cancels a pool
4. `claim_funds()` - Claims funds from a finalized pool
5. `settle_bid()` - Settles a bid with the randomness result

## Transaction Signing

Transactions are signed using the NEAR Wallet Selector, which provides a unified interface for different wallet providers.

## Token Balance Query

Token balances on NEAR are queried through the contract's view methods. The specific method depends on how tokens are implemented in your contract.

## Error Handling

Common error types that should be handled:

1. Insufficient balance
2. Invalid pool status
3. Transaction rejection by user
4. Network connectivity issues

## Testing

For testing, use the NEAR testnet with the contract deployed at `demo.dolla.testnet`.