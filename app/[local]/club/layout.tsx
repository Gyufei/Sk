import WalletProviders from "@/components/wallet-providers";

import "@solana/wallet-adapter-react-ui/styles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <WalletProviders>
    {children}
  </WalletProviders>;
}
