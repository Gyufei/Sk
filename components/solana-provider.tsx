"use client";

import React, { ReactNode, useCallback } from "react";

import {
  WalletError,
  Adapter,
  WalletAdapterNetwork,
} from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { SolflareWalletAdapter } from "@solflare-wallet/wallet-adapter";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export function SolanaWalletProviders({ children }: { children?: ReactNode }) {
  const rpc =
    "https://solana-api.solana.fm/" ||
    clusterApiUrl(WalletAdapterNetwork.Mainnet);

  const wallets = [
    new PhantomWalletAdapter(),
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
