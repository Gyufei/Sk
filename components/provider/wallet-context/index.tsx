"use client";
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { arbitrum, base, bsc, linea, mainnet, optimism, polygon, ronin, sepolia, zkSync } from 'wagmi/chains'
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { useLocale } from "next-intl";
import { useMemo } from 'react';

const chains = [
  mainnet,
  optimism,
  // blast,
  polygon,
  arbitrum,
  ronin,
  bsc,
  base,
  {
    ...linea,
    iconUrl: "/icons/network/linea.svg",
  },
  sepolia,
  zkSync,
];


  /* New API that includes Wagmi's createConfig and replaces getDefaultWallets and connectorsForWallets */
 const config = getDefaultConfig({
  appName: "Web3Modal",
  projectId: "554bbd76b2e66a095d2d38490bb42983",
  chains: chains as any,
  // transports: {
  //   [mainnet.id]: http(),
  // },
  ssr: true,
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const local = useLocale();
  const rainbowLocal = useMemo(() => {
    return local === 'zh' ? 'zh-CN' : 'en'
  }, [local])
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale={rainbowLocal}
          theme={darkTheme({
            accentColor: '#7b3fe4',
            accentColorForeground: 'white',
            borderRadius: 'small',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}