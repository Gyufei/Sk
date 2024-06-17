'use client'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { 
  mainnet,
  optimism,
  // blast,
  polygon,
  arbitrum,
  ronin,
  bsc,
  base,
  linea,
  sepolia,
  zkSync
} from 'viem/chains'

const projectId = "554bbd76b2e66a095d2d38490bb42983";

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://juu17.com", // origin must match your domain & subdomain
  // url: "http://localhost:3000", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [
  mainnet,
  optimism,
  // blast,
  polygon,
  arbitrum,
  ronin,
  bsc,
  base,
  linea,
  sepolia,
  zkSync
]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})

export function Web3Modal({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig as any}>{children}</WagmiConfig>
}