"use client";

import React, { ReactNode, useCallback } from "react";

import { WalletError, Adapter } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { SolflareWalletAdapter } from "@solflare-wallet/wallet-adapter";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

const MainnetRpc =
  "https://solana-mainnet.g.alchemy.com/v2/VrfqWDkKUZYwdo36V2bucaUUq00lbeT1";
const DevnetRpc =
  "https://rpc.ankr.com/solana_devnet" || clusterApiUrl("devnet");

export function SolanaWalletProviders({ children }: { children?: ReactNode }) {
  const rpc = process.env.NODE_ENV === "production" ? MainnetRpc : DevnetRpc;

  const wallets = [
    ...(typeof window === "undefined" ? [] : [new SolflareWalletAdapter()]),
    // new OKXWalletAdapter(),
  ];

  const onError = useCallback((err: WalletError, adapter?: Adapter) => {
    console.error(err);
    console.log(adapter?.name, "error");
  }, []);

  return (
    <ConnectionProvider
      endpoint={rpc!}
      config={{ disableRetryOnRateLimit: true }}
    >
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
