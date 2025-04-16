import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import { ChainLogoText } from "./chain-logo-text";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";

import { IClaimToken } from "@/lib/api/use-claim-tokens";
import { useCheckEthClaimed } from "@/lib/use-check-eth-claimed";
import { useCheckOffChainClaimed } from "@/lib/use-check-off-chain-claimed";
import { useCheckSolClaimed } from "@/lib/use-check-sol-claimed";
import { IClaimData, useClaimData } from "@/lib/use-claim-data";
import { useEthClaim } from "@/lib/use-eth-claim";
import { useOffChainClaim } from "@/lib/use-off-chain-claim";
import { useSolClaim } from "@/lib/use-sol-claim";
import { shorterAddress } from "@/lib/utils/utils";
import { useAppKit } from "@reown/appkit/react";

export function EventContent({
  currentToken,
}: {
  currentToken: IClaimToken | undefined;
}) {
  const router = useRouter();
  const T = useTranslations("Common");
  const isEVM = !!currentToken?.chainInfo?.isEVM;
  const isOffChain = !!(currentToken?.chainInfo as any)?.isOffChain;
  const isSolana = currentToken?.chainInfo?.name === "Solana";

  const { data: userInfo } = useFetchUserInfo();

  const { open: openConnectModal = () => {} } = useAppKit();
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
  } = useEthClaim(currentToken);

  const { claimAction: claimSolanaAction, isPending: isSolPending } =
    useSolClaim(currentToken);

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

  const claimAmount = useMemo(() => {
    if (!claimData) return 0;
    if (
      (claimData as any)?.status === true &&
      (claimData as any)?.data === null
    ) {
      return 0;
    }

    return Number((claimData as any)?.claim_amount);
  }, [claimData]);

  const displayAmount = useMemo(() => {
    if (!claimAmount || !currentToken) return 0;
    if (!currentToken) return 0;

    return Math.floor(claimAmount / 10 ** currentToken?.tokenDecimal || 0);
  }, [claimAmount, currentToken]);

  const {
    data: ethState,
    isLoading: ethReadLoading,
    refetch: refreshEthClaim,
  } = useCheckEthClaimed(currentToken, claimAmount);

  const {
    data: solState,
    isLoading: solReadLoading,
    mutate: refreshSolClaim,
  } = useCheckSolClaimed(currentToken);

  const {
    data: offChainState,
    isLoading: offChainLoading,
    mutate: refreshOffChainClaim,
  } = useCheckOffChainClaimed(currentToken);

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

  function handleClaim() {
    if (isClaimed || isPending || !claimAmount) return;

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
    if (!currentToken) return;

    if (!ethAddress) {
      openConnectModal();
    } else {
      const claimChainId = currentToken.chainInfo.chainId;

      if (String(chainId) !== String(claimChainId)) {
        try {
          await switchChain({
            chainId: claimChainId!,
          });
          claimEthAction(claimData as IClaimData);
        } catch (e) {
          console.error("switch chain error", e);
        }
      } else {
        claimEthAction(claimData as IClaimData);
      }
    }
  }

  async function claimSolana() {
    if (!currentToken) return;

    if (!solanaAddress) {
      setSolanaModalVisible(true);
    } else {
      const res = await claimSolanaAction(claimData as IClaimData);
      if (res) {
        refreshSolClaim();
      }
      return;
    }
  }

  async function claimOffChain() {
    if (!currentToken) return;

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

  function handleConnect() {
    if (isEVM || isOffChain) {
      openConnectModal();
    } else {
      setSolanaModalVisible(true);
    }
  }

  const claimContent = () => {
    if (!currentToken) return null;
    if (isPending) {
      return T("Claiming");
    }
    if (readingLoading) {
      return T("Loading");
    }
    if (isClaimed) {
      return T("Claimed");
    }

    return (
      <>
        <span className="font-bold">{T("Claim")}</span>
        {!currentToken.chainInfo.isOffChain && (
          <div
            style={{
              visibility: isOffChain ? "hidden" : "visible",
            }}
            className="ml-1 flex justify-start"
          >
            <span>{T("On")}</span>
            <ChainLogoText
              logo={currentToken.chainInfo.logo}
              name={currentToken.chainInfo.name}
            />
          </div>
        )}
      </>
    );
  };

  if (!currentToken) {
    return <div className="h-[208px]"></div>;
  }

  if (currentToken.isCutOff) {
    return (
      <div className="flex flex-col items-center justify-center px-5 text-center">
        <div className="text-[40px] leading-9 text-white opacity-80">
          {T("EventExpired")}
        </div>
      </div>
    );
  }

  if (
    ((isEVM || isOffChain) && (userInfo?.wallets?.EVM || []).length === 0) ||
    (isSolana && (userInfo?.wallets?.Solana || []).length === 0)
  ) {
    return (
      <div className="flex flex-col items-center justify-center px-5 text-center">
        <div className="text-center font-haasDisp  text-[28px]">
          {isSolana ? "Solana" : "EVM"} {T("WalletNull")}
        </div>
        <div
          className="mb-[6px] mt-5 box-border flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(255,255,255,0.01)] font-haasDisp text-base opacity-60 hover:opacity-70 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=true]:hover:opacity-50 sm:w-[320px]"
          onClick={() => router.push("/wallets")}
        >
          {T("AddWallet")}
        </div>
      </div>
    );
  }

  if (!currentAddress) {
    return (
      <div className="flex h-[208px] flex-col items-center justify-center">
        <div
          data-disabled={false}
          onClick={handleConnect}
          className="mt-5 box-border flex h-12 w-[240px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(255,255,255,0.01)] opacity-60 hover:opacity-70 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=true]:hover:opacity-50"
        >
          <div className="flex justify-between text-base leading-6 text-white">
            <span>Connect</span>
            {currentToken && (
              <ChainLogoText
                logo={
                  isOffChain
                    ? "/icons/network/ethereum.svg"
                    : currentToken.chainInfo.logo
                }
                name={isOffChain ? "EVM" : currentToken.chainInfo.name}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!claimData) {
    return (
      <div className="flex h-[208px] flex-col items-center justify-center"></div>
    );
  }

  if (claimLoading) {
    return (
      <div className="flex h-[208px] flex-col items-center justify-center">
        <div className="text-base">{T("Loading")}</div>
      </div>
    );
  }

  if (!claimAmount || claimAmount === 0) {
    return (
      <div className="flex h-[208px] flex-col items-center justify-center">
        <div className="text-[40px] leading-9 text-white opacity-80">
          {T("Sorry")}
        </div>
        <div className="mt-[10px] text-center text-[28px] font-medium leading-9 text-white">
          <span className="opacity-60">{T("YouAre")}</span>
          <span className="opacity-80">{T("NotEligible")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center pt-6 sm:py-10">
      <div className="text-[28px] font-medium leading-9 text-white">
        <span className="opacity-60">{T("YouAre")}</span>
        <span className="opacity-80">{T("Eligible")}</span>
      </div>
      <div className="mt-4 flex items-center gap-x-[10px]">
        <div className="text-[36px] font-semibold leading-[54px] text-white">
          {displayAmount}
        </div>
        <div className="flex h-10 items-center rounded-lg bg-[rgba(255,255,255,0.5)] px-3 py-[2px] text-[20px] font-semibold leading-[30px] text-[#262626] outline-none">
          {!isOffChain ? "$" : ""}
          {currentToken.symbol}
        </div>
      </div>
      {
        <div
          data-not={isClaimed || isPending || currentToken.isCutOff}
          onClick={handleClaim}
          className="mt-5 box-border flex h-12 w-[240px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(255,255,255,0.01)] opacity-60 hover:opacity-70 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=true]:hover:opacity-50"
        >
          <div className="flex justify-between text-base leading-6 text-white">
            {claimContent()}
          </div>
        </div>
      }

      {!isClaimed && !currentToken.isCutOff && !readingLoading && (
        <div className="text-[rgba(255, 255, 255, 0.6)] mt-[10px] font-haasDisp text-base font-medium">
          {T("ConnectedTo")} {shorterAddress(currentAddress)}
        </div>
      )}
    </div>
  );
}
