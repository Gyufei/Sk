"use client";
import { createWeb3Modal } from "@web3modal/wagmi/react";

import { http, createConfig, WagmiProvider } from "wagmi";
/*
Solana
OP Main-net
Ethereum 
BNB Chain
Sui
Blast
Base
Arbitrum
Polygon
Ronin
*/
import {
  mainnet,
  optimism,
  blast,
  polygon,
  arbitrum,
  ronin,
  bsc,
  base,
} from "wagmi/chains";
import { walletConnect, injected } from "wagmi/connectors";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "554bbd76b2e66a095d2d38490bb42983";

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://juu17.com", // origin must match your domain & subdomain
  // url: "http://localhost:3000", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const config = createConfig({
  chains: [optimism, mainnet, bsc, blast, polygon, arbitrum, ronin, base],
  transports: {
    [optimism.id]: http(),
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [blast.id]: http(),
    [ronin.id]: http(),
    [base.id]: http(),
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
  ],
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  defaultChain: optimism,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  // enableOnramp: true, // Optional - false as default
  featuredWalletIds: [
    "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
  ],
});

export function WcProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
