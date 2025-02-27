import { isProduction } from "@/lib/api/path";
import { EthChainInfos, SolanaChainInfos } from "@/lib/const";

export const payChain = [
  SolanaChainInfos.Solana,
  EthChainInfos.Ethereum,
  EthChainInfos.OP,
] as const;

export interface IPayToken {
  name: string;
  icon: string;
  isStable: boolean;
  address: string;
  decimals: number;
}

export const payTokenConfig: Record<string, IPayToken[]> = {
  [EthChainInfos.Ethereum.name]: [
    {
      name: "USDT",
      icon: "/icons/usdt.svg",
      isStable: true,
      address: isProduction
        ? "0xdAC17F958D2ee523a2206206994597C13D831ec7"
        : "0xd2bB751e65fD6DBb224872ED7Df807f29b0F98aa",
      decimals: 6,
    },
    {
      name: "USDC",
      icon: "/icons/usdc.svg",
      isStable: true,
      address: isProduction
        ? "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
        : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
    },
    {
      name: "ETH",
      icon: "/icons/eth.svg",
      isStable: false,
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
    },
  ],
  [SolanaChainInfos.Solana.name]: [
    {
      name: "USDT",
      icon: "/icons/usdt.svg",
      isStable: true,
      address: isProduction
        ? "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
        : "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
      decimals: 6,
    },
    {
      name: "USDC",
      icon: "/icons/usdc.svg",
      isStable: true,
      address: isProduction
        ? "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      decimals: 6,
    },
    {
      name: "SOL",
      icon: "/icons/solana.svg",
      isStable: false,
      address: "So11111111111111111111111111111111111111112",
      decimals: 9,
    },
  ],
  [EthChainInfos.OP.name]: [
    {
      name: "USDC",
      icon: "/icons/usdc.svg",
      isStable: true,
      address: isProduction
        ? "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"
        : "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
      decimals: 6,
    },
    {
      name: "ETH",
      icon: "/icons/eth.svg",
      isStable: false,
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
    },
  ],
} as const;
