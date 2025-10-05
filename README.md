# PushChain Universal Onboarding Kit

A drop-in React component that enables walletless onboarding and universal cross-chain interactions powered by Push Chain's testnet "Donut".

## Features

- **Universal Onboarding**: Email/social login without wallet popups
- **Cross-Chain Actions**: Single session, multiple chains
- **Gas Abstraction**: Sponsored transactions during demo
- **Real-time Updates**: WebSocket-powered activity feed
- **Drop-in Integration**: One-line install for any dApp

## Quickstart

```bash
pnpm install
pnpm -r dev
```

**Apps:**
- Demo: http://localhost:5173
- Relayer: http://localhost:8787/health

### .env

```bash
cp .env.example .env
# Later, set VITE_PUSH_RPC to Donut RPC
# RELAYER_PRIVATE_KEY for sponsored tx on testnet
```

## Usage

```tsx
import { OnboardProvider, OnboardKit } from '@pushlabs/onboardkit'

<OnboardProvider rpcUrl={import.meta.env.VITE_PUSH_RPC}>
  <OnboardKit
    actions={[
      { id: "mint", label: "Mint NFT", chain: "push", method: "nft.mint" },
      { id: "tip", label: "Tip Creator", chain: "other", method: "payments.send" }
    ]}
  />
</OnboardProvider>
```

## Project G.U.D Submission

Built for Push Chain's Project G.U.D Deploython (Sept 18 - Oct 13, 2025)

- **Live Demo**: [TBD]
- **GitHub**: [TBD]
- **Video**: [TBD]
 

## Architecture

- **Frontend**: React + Vite + Tailwind
- **Backend**: Node/Express relayer
- **Blockchain**: Push Chain SDK + Donut testnet
- **Auth**: Email magic links + JWT sessions
