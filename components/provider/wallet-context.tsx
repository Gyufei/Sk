"use client";
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

import {
  arbitrum,
  base,
  bsc,
  linea,
  mainnet,
  optimism,
  polygon,
  ronin,
  sepolia,
  zksync,
  solana,
} from "@reown/appkit/networks";

import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { OKXWalletAdapter } from "./okx-wallet-adapter";
import { ReactNode } from "react";
import {
  Config,
  cookieStorage,
  cookieToInitialState,
  createStorage,
  // http,
  WagmiProvider,
} from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const networks: any[] = [
  arbitrum,
  base,
  bsc,
  linea,
  mainnet,
  optimism,
  polygon,
  ronin,
  sepolia,
  zksync,
  solana,
];

const projectId = "554bbd76b2e66a095d2d38490bb42983";

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  // transports: {
  //   [mainnet.id]: http(),
  //   [base.id]: http(),
  //   [optimism.id]: http(),
  //   [polygon.id]: http(),
  //   [arbitrum.id]: http(),
  //   [bsc.id]: http(),
  //   [linea.id]: http(),
  //   [ronin.id]: http(),
  //   [sepolia.id]: http('https://rpc.ankr.com/eth_sepolia'),
  //   [zksync.id]: http(),
  // },
  projectId,
  networks,
});

// 2. Create Solana adapter
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [
    new PhantomWalletAdapter() as any,
    new SolflareWalletAdapter() as any,
    new OKXWalletAdapter() as any,
  ],
});

// 3. Set up the metadata - Optional
const metadata = {
  name: "Juu17 Brands",
  description: "Juu17 Brands",
  url: "https://juu17.com", // origin must match your domain & subdomain
  icons: ["https://juu17.com/logo.svg"],
};

// 4. Create the AppKit instance
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const modal = createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter],
  networks: networks as any,
  metadata,
  projectId,
  features: {
    analytics: true,
    swaps: false,
    onramp: false,
    email: false,
    socials: false,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#7b3fe4",
  },
});

const queryClient = new QueryClient();

export function Web3Provider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies,
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
