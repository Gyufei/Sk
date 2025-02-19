import { EthChainInfos, SolanaChainInfos } from "@/lib/const";

export const payChain = [
  EthChainInfos.Ethereum,
  EthChainInfos.OP,
  SolanaChainInfos.Solana,
] as const;

export interface IPayToken {
  name: string;
  icon: string;
  isStable: boolean;
  address: string;
}

export const payTokenConfig: Record<string, IPayToken[]> = {
  [EthChainInfos.Ethereum.name]: [
    {
      name: "USDT",
      icon: "/icons/usdt.svg",
      isStable: true,
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    {
      name: "USDC",
      icon: "/icons/usdc.svg",
      isStable: true,
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    {
      name: "ETH",
      icon: "/icons/eth.svg",
      isStable: false,
      address: "0x0000000000000000000000000000000000000000",
    },
  ],
  [SolanaChainInfos.Solana.name]: [
    {
      name: "USDT",
      icon: "/icons/usdt.svg",
      isStable: true,
      address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    },
    {
      name: "USDC",
      icon: "/icons/usdc.svg",
      isStable: true,
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    },
    {
      name: "SOL",
      icon: "/icons/solana.svg",
      isStable: false,
      address: "So11111111111111111111111111111111111111112",
    },
  ],
  [EthChainInfos.OP.name]: [
    {
      name: "USDC",
      icon: "/icons/usdc.svg",
      isStable: true,
      address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    },
    {
      name: "ETH",
      icon: "/icons/eth.svg",
      isStable: false,
      address: "0x0000000000000000000000000000000000000000",
    },
  ],
} as const;
