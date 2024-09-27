"use client";

import { SolanaWalletProviders } from "@/components/solana-provider";

export function SolWalletProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SolanaWalletProviders>{children}</SolanaWalletProviders>;
}
