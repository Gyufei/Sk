"use client";

import React, { ReactNode, useCallback } from "react";

import { isProduction } from "@/lib/api/path";
import { WalletError, Adapter } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { SolflareWalletAdapter } from "@solflare-wallet/wallet-adapter";
import { OKXWalletAdapter } from "./okx-wallet-adapter";
// import { clusterApiUrl } from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

const MainnetRpc =
  "https://mainnet.helius-rpc.com/?api-key=6e25109f-21ec-4fd2-9e2d-027213f5cd6e";
const DevnetRpc = clusterApiUrl("devnet");
// || "https://devnet.helius-rpc.com/?api-key=6e25109f-21ec-4fd2-9e2d-027213f5cd6e" ||

export function SolanaWalletProviders({ children }: { children?: ReactNode }) {
  const rpc = isProduction ? MainnetRpc : DevnetRpc;

  const wallets = [
    ...(typeof window === "undefined" ? [] : [new SolflareWalletAdapter()]),
    new OKXWalletAdapter(),
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
