"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IProduct } from "@/lib/api/use-mart-products";
import { useMediaQuery } from "@/lib/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/utils";
import { IChain, SolanaChainInfos } from "@/lib/const";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useTransactionCount,
} from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAppKit, useAppKitState } from "@reown/appkit/react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { IPayToken, payChain, payTokenConfig } from "./pay-config";
import { useEthPay } from "@/lib/use-eth-pay";
import { useSolPay } from "@/lib/use-sol-pay";
import { useCreateOrder } from "@/lib/api/use-create-order";
import { GlobalMsgContext } from "@/components/global-msg-context";

export default function PayDialog({
  open,
  onOpenChange,
  productInfo,
}: {
  open: boolean;
  onOpenChange: (_v: boolean) => void;
  productInfo: IProduct;
}) {
  const T = useTranslations("Common");
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { setGlobalMessage } = useContext(GlobalMsgContext);

  const { address: ethAddress } = useAccount();
  const { open: openConnectModal = () => {} } = useAppKit();
  const { open: isEthConnectOpen } = useAppKitState();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: nonceData } = useTransactionCount({
    address: ethAddress,
  });

  const { publicKey } = useWallet();
  const solanaAddress = useMemo(
    () => (publicKey ? publicKey.toBase58() : ""),
    [publicKey],
  );
  const { setVisible: setSolanaModalVisible, visible: isSolanaModalOpen } =
    useWalletModal();

  const { trigger: buyAction, isMutating } = useCreateOrder();

  const [chain, setChain] = useState<IChain>(payChain[0]);
  const [token, setToken] = useState<IPayToken>(payTokenConfig[chain.name][0]);
  const [tokenOpen, setTokenOpen] = useState<boolean>(false);
  const [chainOpen, setChainOpen] = useState<boolean>(false);

  const {
    payAction: payEthAction,
    isPending: isEthPending,
    isSuccess: isEthSuccess,
    isError: isEthError,
    reset: resetEthAction,
  } = useEthPay(chain, token);

  const {
    payAction: paySolanaAction,
    isPending: isSolanaPending,
    isSuccess: isSolanaSuccess,
    isError: isSolanaError,
    reset: resetSolanaAction,
  } = useSolPay(token);

  const showTokenList = useMemo(() => {
    return payTokenConfig[chain.name];
  }, [chain]);

  const isEvm = useMemo(() => {
    return chain.isEVM;
  }, [chain]);

  const isSolana = useMemo(() => {
    return chain.name === SolanaChainInfos.Solana.name;
  }, [chain]);

  const shouldConnect = useMemo(() => {
    if (isEvm) {
      return !ethAddress;
    }

    if (isSolana) {
      return !solanaAddress;
    }

    return false;
  }, [isEvm, isSolana, ethAddress, solanaAddress]);

  const shouldSwitchChain = useMemo(() => {
    if (isEvm && chainId === 11155111) {
      return false;
    }

    if (!isEvm || !ethAddress) {
      return false;
    }

    if (chainId !== chain.chainId) {
      return true;
    }

    return false;
  }, [isEvm, chainId, ethAddress, chain.chainId]);

  async function handleCreateOrder() {
    if (isMutating) {
      return;
    }

    const productId = productInfo.product_id;
    const chainName = chain.name;
    const chainCoin = token.name;
    const paymentWallet = isEvm ? ethAddress : solanaAddress;
    const nonce = isEvm ? nonceData : null;
    const extraData = productInfo.skuOfUserCheck?.selectedSize
      ? {
          skuAttr: productInfo.skuOfUserCheck?.selectedSize,
        }
      : null;

    const res = await buyAction({
      productId,
      extraData,
      chainName,
      chainCoin,
      paymentWallet,
      nonce,
    } as any);

    if (res.status === false && res.msg) {
      setGlobalMessage({
        type: "error",
        message: res.msg,
      });
    } else if (res) {
      handlePayConfirm(res);
    }
  }

  function handlePayConfirm(orderInfo: { product_price: string }) {
    if (isEvm) {
      payEthAction(orderInfo);
    }

    if (isSolana) {
      paySolanaAction(orderInfo);
    }
  }

  function handleChainChange(c: IChain) {
    setChain(c);

    const selectToken = payTokenConfig[c.name].find(
      (t: Record<string, any>) => t.name === token.name,
    );

    if (!selectToken) {
      setToken(payTokenConfig[c.name][0]);
    } else {
      setToken(selectToken);
    }

    setChainOpen(false);
  }

  function handleTokenChange(t: IPayToken) {
    setToken(t);
    setTokenOpen(false);
  }

  function handleConnect() {
    if (isEvm) {
      openConnectModal();
    }

    if (isSolana) {
      setSolanaModalVisible(true);
    }
  }

  function handleSwitchChain() {
    if (!shouldSwitchChain) {
      return;
    }

    switchChain({
      chainId: chain.chainId as number,
    });
  }

  useEffect(() => {
    if (isMutating) {
      setGlobalMessage({
        type: "success",
        message: T("PayingIsBeingInitiated"),
      });
    }
  }, [isMutating, T, setGlobalMessage]);

  useEffect(() => {
    if (isEthSuccess || isSolanaSuccess) {
      onOpenChange(false);
      setGlobalMessage({
        type: "success",
        message: T("PaySuccess"),
      });
      resetEthAction();
      resetSolanaAction();
    }
  }, [
    isEthSuccess,
    isSolanaSuccess,
    onOpenChange,
    T,
    resetEthAction,
    resetSolanaAction,
    setGlobalMessage,
  ]);

  useEffect(() => {
    if (isEthError || isSolanaError) {
      setGlobalMessage({
        type: "error",
        message: T("PayFailed"),
      });
      resetEthAction();
      resetSolanaAction();
    }
  }, [
    isEthError,
    isSolanaError,
    onOpenChange,
    T,
    resetEthAction,
    resetSolanaAction,
    setGlobalMessage,
  ]);

  const payContent = (
    <div className={`${!isDesktop && "paddingBottomStyle-64"}`}>
      <div className="text-base leading-6 text-white">{T("Token")}</div>
      <Popover open={tokenOpen} onOpenChange={setTokenOpen}>
        <PopoverTrigger className="mt-2 flex h-12 w-full items-center justify-between rounded border border-solid px-2">
          <div className="flex items-center gap-x-2 text-base leading-6 text-white">
            <Image src={token?.icon} width={24} height={24} alt="token" />
            <span>{token?.name}</span>
          </div>
          <Image
            data-open={tokenOpen}
            src="/icons/arrow-down.svg"
            width={24}
            height={24}
            alt="down"
            className="data-[open=true]:rotate-180"
          />
        </PopoverTrigger>
        <PopoverContent
          className={`no-scroll-bar z-[1000] flex w-screen flex-col items-stretch space-y-2 overflow-y-auto border-none bg-[#262626] p-4 sm:w-[435px]`}
        >
          {showTokenList.map((t) => (
            <div
              key={t.name}
              className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] hover:brightness-75"
              onClick={() => {
                handleTokenChange(t);
              }}
            >
              <div
                className="ml-3 text-base leading-6 sm:text-sm"
                style={{
                  color:
                    token?.name === t.name ? "rgba(255,255,255)" : "#d6d6d6",
                }}
              >
                {t.name}
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>
      <div className="mt-2 text-base leading-6 text-white">{T("Chain")}</div>
      <Popover open={chainOpen} onOpenChange={setChainOpen}>
        <PopoverTrigger className="mt-2 flex h-12 w-full items-center justify-between rounded border border-solid px-2">
          <div className="flex items-center gap-x-2 text-base leading-6 text-white">
            <Image src={chain?.logo} width={24} height={24} alt="chain" />
            <span>{chain?.name}</span>
          </div>
          <Image
            data-open={chainOpen}
            src="/icons/arrow-down.svg"
            width={24}
            height={24}
            alt="down"
            className="data-[open=true]:rotate-180"
          />
        </PopoverTrigger>
        <PopoverContent
          className={`no-scroll-bar z-[1000] flex w-screen flex-col items-stretch space-y-2 overflow-y-auto border-none bg-[#262626] p-4 sm:w-[435px]`}
        >
          {payChain.map((c) => (
            <div
              key={c.name}
              className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] hover:brightness-75"
              onClick={() => {
                handleChainChange(c);
              }}
            >
              <div
                className="ml-3 text-base leading-6 sm:text-sm"
                style={{
                  color:
                    chain?.name === c.name ? "rgba(255,255,255)" : "#d6d6d6",
                }}
              >
                {c.name}
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>
      {shouldConnect ? (
        <BottomBtn onClick={handleConnect}>
          <span>{T("Connect")}</span>
          <span className="flex items-center gap-x-1">
            <Image src={chain.logo} width={24} height={24} alt="right" />
            <span>{chain.name}</span>
          </span>
        </BottomBtn>
      ) : (
        <>
          {shouldSwitchChain ? (
            <BottomBtn onClick={handleSwitchChain}>
              <span>{T("SwitchTo")}</span>
              <span className="flex items-center gap-x-1">
                <Image src={chain.logo} width={24} height={24} alt="right" />
                <span>{chain.name}</span>
              </span>
            </BottomBtn>
          ) : (
            <BottomBtn
              disabled={isEthPending || isSolanaPending || isMutating}
              onClick={handleCreateOrder}
            >
              <span>
                {isEthPending || isSolanaPending
                  ? T("Paying")
                  : T("ConfirmToPay")}
              </span>
            </BottomBtn>
          )}
        </>
      )}
    </div>
  );

  function preventClose(e: any) {
    if (isEthConnectOpen || isSolanaModalOpen) {
      e.preventDefault();
    }
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showOverlay={false}
          showClose={true}
          onInteractOutside={preventClose}
          className={
            "rounded-5 flex w-[480px] flex-col border-none bg-[#252525] p-6"
          }
        >
          <DialogTitle className="font-haasDisp text-white">
            {T("Pay")}
          </DialogTitle>
          <div>{payContent}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent onInteractOutside={preventClose}>
        <DrawerHeader className="py-0 text-center">
          <DrawerTitle>{T("Pay")}</DrawerTitle>
        </DrawerHeader>
        <div className="no-scroll-bar relative overflow-y-auto">
          {payContent}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function BottomBtn({
  onClick,
  children,
  disabled = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  return (
    <div
      className={cn(
        "bg-[#252525]",
        disabled && "pointer-events-none opacity-50",
        !isDesktop &&
          "z-100 paddingBottomStyle-16 fixed bottom-0 left-0 right-0 px-[16px]",
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "mt-[40px] flex h-12 w-full cursor-pointer items-center justify-center gap-x-2 rounded-lg border border-solid border-[rgba(255,255,255,0.6)] text-base leading-6 text-white hover:brightness-100",
          isDesktop && "mt-[40px]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
