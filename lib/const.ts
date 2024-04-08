export const ChainInfos: Record<
  string,
  {
    logo: string;
    isEVM?: boolean;
    chainId?: number;
  }
> = {
  "OP Mainnet": {
    logo: "./images/network-icons/op.svg",
    isEVM: true,
    chainId: 10,
  },
  Ethereum: {
    logo: "./images/network-icons/ethereum.svg",
    isEVM: true,
    chainId: 1,
  },
  "BNB Chain": {
    logo: "./images/network-icons/bnb.svg",
    isEVM: true,
    chainId: 56,
  },
  Polygon: {
    logo: "./images/network-icons/polygon.svg",
    isEVM: true,
    chainId: 137,
  },
  Arbitrum: {
    logo: "./images/network-icons/arb.svg",
    isEVM: true,
    chainId: 42161,
  },
  Blast: {
    logo: "./images/network-icons/blast.svg",
    isEVM: true,
    chainId: 81457,
  },
  Ronin: {
    logo: "./images/network-icons/ronin.svg",
    isEVM: true,
    chainId: 2020,
  },
  Base: {
    logo: "./images/network-icons/base.svg",
    isEVM: true,
    chainId: 8453,
  },
  Solana: {
    logo: "./images/network-icons/solana.svg",
    isEVM: false,
    chainId: 1,
  },
  Sui: {
    logo: "./images/network-icons/sui.svg",
    isEVM: false,
    chainId: 2,
  },
};
