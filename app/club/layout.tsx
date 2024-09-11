import "@solana/wallet-adapter-react-ui/styles.css";
import { SolanaWalletProviders } from "@/components/solana-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SolanaWalletProviders>{children}</SolanaWalletProviders>;
}
