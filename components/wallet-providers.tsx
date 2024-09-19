"use client";

import { SolanaWalletProviders } from "@/components/solana-provider";
import { SuiProvider } from "@/components/sui-provider";

export default function WalletProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SolanaWalletProviders>
      <SuiProvider>{children}</SuiProvider>
    </SolanaWalletProviders>
  );
}
