"use client";

import { SolanaWalletProviders } from "@/components/solana-provider";

export default function WalletProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SolanaWalletProviders>
      {/* <SuiProvider>{children}</SuiProvider> */}
      {children}
    </SolanaWalletProviders>
  );
}
