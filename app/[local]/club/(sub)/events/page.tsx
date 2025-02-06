"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import { useConnectModal } from "@rainbow-me/rainbowkit";

import { GoBackTo } from "@/components/go-back-to";
import { IClaimToken, useClaimTokens } from "@/lib/api/use-claim-tokens";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useCheckEthClaimed } from "@/lib/use-check-eth-claimed";
import { useCheckOffChainClaimed } from "@/lib/use-check-off-chain-claimed";
import { useCheckSolClaimed } from "@/lib/use-check-sol-claimed";
import { useClaimData } from "@/lib/use-claim-data";
import { useEthClaim } from "@/lib/use-eth-claim";
import { useOffChainClaim } from "@/lib/use-off-chain-claim";
import { useSolClaim } from "@/lib/use-sol-claim";
import { EventContent } from "./event-content";
import { CoinList } from "./coin-list";
import { BreadCrumbs } from "@/components/bread-crumbs";

export default function EventsPage() {
  const { data: claimTokensData } = useClaimTokens();
  const { claimTokens, claimChunkArray: claimArray } = claimTokensData || {
    claimTokens: [],
    claimChunkArray: [],
  };

  const { data: userInfo } = useFetchUserInfo();
  const { openConnectModal = () => {} } = useConnectModal();
  const { switchChain } = useSwitchChain();

  // eth
  const chainId = useChainId();
  const { address: ethAddress } = useAccount();

  // sol
  const { publicKey } = useWallet();
  const { setVisible: setSolanaModalVisible } = useWalletModal();
  const solanaAddress = useMemo(
    () => (publicKey ? publicKey.toBase58() : ""),
    [publicKey],
  );

  const [currentToken, setCurrentToken] = useState(claimTokens[0]);

  const isOffChain = !!(currentToken?.chainInfo as any)?.isOffChain;
  const isEVM = !!currentToken?.chainInfo?.isEVM;
  const isSolana = currentToken?.chainInfo?.name === "Solana";

  const currentAddress = useMemo(() => {
    if (isEVM || isOffChain) {
      return ethAddress;
    }

    if (isSolana) {
      return solanaAddress;
    }
  }, [ethAddress, solanaAddress, isEVM, isOffChain, isSolana]);

  const {
    claimAction: claimEthAction,
    isPending: isEthPending,
    isSuccess: isEthSuccess,
  } = useEthClaim(
    (currentToken?.chainInfo?.name?.toLowerCase() as any) || "ethereum",
  );

  const { claimAction: claimSolanaAction, isPending: isSolPending } =
    useSolClaim();

  const {
    trigger: claimOffChainAction,
    isPending: isOffChainPending,
    isSuccess: isOffChainSuccess,
  } = useOffChainClaim();

  const isPending = useMemo(() => {
    if (isOffChain) {
      return isOffChainPending;
    }

    if (isEVM) {
      return isEthPending;
    }

    if (isSolana) {
      return isSolPending;
    }
  }, [
    isOffChain,
    isEVM,
    isSolana,
    isOffChainPending,
    isEthPending,
    isSolPending,
  ]);

  const { data: claimData, isLoading: claimLoading } = useClaimData(
    currentToken,
    currentAddress,
  );

  const canClaim = useMemo(() => {
    if (!currentAddress) return false;
    if (isEVM || isOffChain) {
      return (
        userInfo?.wallets?.EVM?.length &&
        (userInfo?.wallets?.EVM || []).includes(currentAddress)
      );
    } else if (isSolana) {
      return (
        userInfo?.wallets?.Solana?.length &&
        (userInfo?.wallets?.Solana || []).includes(currentAddress)
      );
    }

    return false;
  }, [isEVM, isOffChain, isSolana, userInfo, currentAddress]);

  const claimAmount = useMemo(() => {
    if (!claimData || !canClaim) return 0;
    if (claimData?.status === true && claimData.data === null) return 0;
    return Number(claimData?.claim_amount);
  }, [claimData, canClaim]);

  const showClaimAmount = useMemo(() => {
    if (!claimAmount) return 0;
    return Math.floor(claimAmount / 10 ** currentToken?.tokenDecimal || 0);
  }, [claimAmount, currentToken]);

  const {
    data: ethState,
    isLoading: ethReadLoading,
    refetch: refreshEthClaim,
  } = useCheckEthClaimed(
    isEVM,
    (currentToken?.chainInfo?.name?.toLowerCase() as any) || "ethereum",
    currentToken?.eventData,
    claimAmount,
  );

  const {
    data: solState,
    isLoading: solReadLoading,
    mutate: refreshSolClaim,
  } = useCheckSolClaimed(isSolana, currentToken?.eventData);

  const {
    data: offChainState,
    isLoading: offChainLoading,
    mutate: refreshOffChainClaim,
  } = useCheckOffChainClaimed(
    isOffChain,
    currentToken?.eventData?.project_name,
    currentToken?.eventData?.claim_version,
  );

  const isClaimed = useMemo(() => {
    if (isOffChain) {
      return offChainState?.claimed;
    }

    if (isEVM) {
      return ethState?.claimed;
    }

    if (isSolana) {
      return solState?.claimed;
    }
  }, [isEVM, isOffChain, isSolana, ethState, solState, offChainState]);

  const readingLoading = useMemo(() => {
    if (isOffChain) {
      return offChainLoading;
    }

    if (isEVM) {
      return ethReadLoading;
    }

    if (isSolana) {
      return solReadLoading;
    }
  }, [
    isEVM,
    isOffChain,
    isSolana,
    ethReadLoading,
    solReadLoading,
    offChainLoading,
  ]);

  useEffect(() => {
    if (isEthSuccess) {
      refreshEthClaim();
    }
  }, [isEthSuccess, refreshEthClaim]);

  useEffect(() => {
    if (isOffChainSuccess) {
      refreshOffChainClaim();
    }
  }, [isOffChainSuccess, refreshOffChainClaim]);

  useEffect(() => {
    if (claimTokens?.length) {
      setCurrentToken(claimTokens[0]);
    }
  }, [claimTokens]);

  function handleClaim() {
    if (isClaimed || isPending || !canClaim) return;
    if (!currentToken || !currentToken.chainInfo || currentToken.isCutOff)
      return;

    if (isOffChain) {
      claimOffChain();
      return;
    }

    if (isEVM) {
      claimEvm();
      return;
    }

    if (isSolana) {
      claimSolana();
    }
  }

  async function claimEvm() {
    if (!ethAddress) {
      openConnectModal();
    } else {
      const claimChainId = currentToken.chainInfo.chainId;

      if (String(chainId) !== String(claimChainId)) {
        try {
          await switchChain({
            chainId: claimChainId!,
          });
          claimEthAction(claimAmount!, claimData.proofs);
        } catch (e) {
          console.error("switch chain error", e);
        }
      } else {
        claimEthAction(claimAmount!, claimData.proofs);
      }
    }
  }

  async function claimSolana() {
    if (!solanaAddress) {
      setSolanaModalVisible(true);
    } else {
      const res = await claimSolanaAction(
        claimAmount!,
        claimData.proofs,
        currentToken?.eventData,
      );
      if (res) {
        refreshSolClaim();
      }
      return;
    }
  }

  async function claimOffChain() {
    try {
      claimOffChainAction({
        wallet: ethAddress,
        eventName: currentToken.eventData.project_name,
        claimVersion: currentToken.eventData.claim_version,
      } as any);
    } catch (e) {
      console.error("claim off chain error", e);
    }
  }

  const scrollRef = useRef<HTMLDivElement>(null);

  function handleClickToken(t: IClaimToken) {
    if (!t) return;
    setCurrentToken(t);

    if (!scrollRef.current) return;
  }

  function handleConnect() {
    if (isEVM || isOffChain) {
      openConnectModal();
    } else {
      setSolanaModalVisible(true);
    }
  }

  return (
    <div className="content-w-560">
      <div className="relative flex flex-row-reverse items-end justify-between sm:flex-row">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <div>
        <div className="relative mt-6 flex w-full flex-col-reverse sm:flex-row sm:justify-between">
          <CoinList
            claimArray={claimArray}
            currentToken={currentToken}
            onClick={handleClickToken}
          />
          <div className="bg-blur12 flex h-[256px] w-full flex-col items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.1)] sm:h-[320px] sm:w-[480px]">
            <EventContent
              currentToken={currentToken}
              currentAddress={currentAddress}
              claimData={claimData}
              claimLoading={claimLoading}
              claimAmount={claimAmount}
              showClaimAmount={showClaimAmount}
              isClaimed={isClaimed}
              isPending={isPending}
              readingLoading={readingLoading}
              handleConnect={handleConnect}
              handleClaim={handleClaim}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
