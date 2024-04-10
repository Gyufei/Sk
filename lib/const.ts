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
    logo: "./images/network-icons/op.svg",
    isEVM: true,
    chainId: 10,
  },
  Ethereum: {
    name: "Ethereum",
    logo: "./images/network-icons/ethereum.svg",
    isEVM: true,
    chainId: 1,
  },
  "BNB Chain": {
    name: "BNB Chain",
    logo: "./images/network-icons/bnb.svg",
    isEVM: true,
    chainId: 56,
  },
  Polygon: {
    name: "Polygon",
    logo: "./images/network-icons/polygon.svg",
    isEVM: true,
    chainId: 137,
  },
  Arbitrum: {
    name: "Arbitrum",
    logo: "./images/network-icons/arb.svg",
    isEVM: true,
    chainId: 42161,
  },
  Blast: {
    name: "Blast",
    logo: "./images/network-icons/blast.svg",
    isEVM: true,
    chainId: 81457,
  },
  Ronin: {
    name: "Ronin",
    logo: "./images/network-icons/ronin.svg",
    isEVM: true,
    chainId: 2020,
  },
  Base: {
    name: "Base",
    logo: "./images/network-icons/base.svg",
    isEVM: true,
    chainId: 8453,
  },
  Solana: {
    name: "Solana",
    logo: "./images/network-icons/solana.svg",
    isEVM: false,
    chainId: 1,
  },
  Sui: {
    name: "Sui",
    logo: "./images/network-icons/sui.svg",
    isEVM: false,
    chainId: 2,
  },
};
