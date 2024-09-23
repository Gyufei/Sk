export const ChainInfos: Record<
  string,
  {
    name: string;
    logo: string;
    isEVM?: boolean;
    chainId?: number;
  }
> = {
  "OP Mainnet": {
    name: "OP Mainnet",
    logo: "/icons/network/op.svg",
    isEVM: true,
    chainId: 10,
  },
  Ethereum: {
    name: "Ethereum",
    logo: "/icons/network/ethereum.svg",
    isEVM: true,
    chainId: 1,
  },
  "BNB Chain": {
    name: "BNB Chain",
    logo: "/icons/network/bnb.svg",
    isEVM: true,
    chainId: 56,
  },
  Polygon: {
    name: "Polygon",
    logo: "/icons/network/polygon.svg",
    isEVM: true,
    chainId: 137,
  },
  Arbitrum: {
    name: "Arbitrum",
    logo: "/icons/network/arb.svg",
    isEVM: true,
    chainId: 42161,
  },
  Blast: {
    name: "Blast",
    logo: "/icons/network/blast.svg",
    isEVM: true,
    chainId: 81457,
  },
  Ronin: {
    name: "Ronin",
    logo: "/icons/network/ronin.svg",
    isEVM: true,
    chainId: 2020,
  },
  Base: {
    name: "Base",
    logo: "/icons/network/base.svg",
    isEVM: true,
    chainId: 8453,
  },
  Solana: {
    name: "Solana",
    logo: "/icons/network/solana.svg",
    isEVM: false,
    chainId: 1,
  },
  Sui: {
    name: "Sui",
    logo: "/icons/network/sui.svg",
    isEVM: false,
    chainId: 2,
  },
  Linea: {
    name: "Linea",
    logo: "/icons/network/linea.svg",
    isEVM: true,
    chainId: 59144,
  },
  ZKSync: {
    name: "ZKSync",
    logo: "/icons/network/zksync.svg",
    isEVM: true,
    chainId: 324,
  }
};
