"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useAccount, useDisconnect } from "wagmi";
import { useWalletVerify } from "@/lib/api/use-wallet-verify";
import { useRemoveWallet } from "@/lib/api/use-remove-wallet";
import { ConnectBtn } from "./connect-btn";
import { GlobalMsgContext } from "@/components/global-msg-context";

import {
  useConnectModal,
  useChainModal,
} from '@rainbow-me/rainbowkit';

export function EthWalletItem({
  address,
  isVerify,
  setAddress,
  handleRemove,
  serialNumber,
  handleAdd,
}: {
  address: string;
  isVerify: boolean;
  serialNumber: number;
  setAddress: (_a: string) => void;
  handleRemove: () => void;
  handleAdd: () => void;
}) {
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const { address: connectAddress } = useAccount();
  const { openConnectModal = () => {}} = useConnectModal();
  const { openChainModal = () => {} } = useChainModal();

  const { disconnectAsync: disconnect, isPending: isDisconnecting } =
    useDisconnect();

  const { data: userInfo, getUserInfo } = useFetchUserInfo();
  const { walletVerify } = useWalletVerify();
  const { trigger: removeWalletAction } = useRemoveWallet();

  const [isWaitingForNewConnect, setIsWaitingForNewConnect] = useState(false);
  const [isOperating, setIsOperating] = useState(false);

  useEffect(() => {
    if (!isWaitingForNewConnect || !connectAddress) return;
    if (connectAddress === address) {
      return;
    }

    verifyWalletAction();
  }, [isWaitingForNewConnect, connectAddress, address]);

  async function handleConnect() {
    if (isOperating || isDisconnecting) return;
    if (address && connectAddress === address) {
      return;
    }
    // if login with wallet
    const userWalletAddress = userInfo?.login_data?.wallet_address;
    if (userWalletAddress && connectAddress === userWalletAddress) {
      openChainModal()
      return;
    }

    setIsOperating(true);
    await disconnect();
    setIsOperating(false);
    openConnectModal();
    setIsWaitingForNewConnect(true);
    
  }

  
  async function handleDisconnect() {
    if (isOperating || isDisconnecting) return;

    if (address === userInfo?.login_data?.wallet_address) {
      setGlobalMessage({
        type: "error",
        message: "You cannot connect to the wallet that is being logged in.",
      });
      return;
    }
    setIsOperating(true)
    await disconnect();
    setIsOperating(false)
  }
  
  async function verifyWalletAction() {
    try {
      const res = await walletVerify({
        chain_name: "EVM",
        addr: connectAddress!,
        signature: "",
        salt: "",
      });

      if (res) {
        setAddress(connectAddress!);
        setIsWaitingForNewConnect(false);
        getUserInfo();
      }
    } catch (e) {
      console.error("error", e);
    }
  }

  // TODO: remove
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function removeWallet() {
    const res: any = await removeWalletAction({
      chainName: "EVM",
      serialNumber,
    });

    if (res.status) {
      handleRemove();
    }
  }
  

  return (
    <div className="mb-6 flex flex-col items-start jm:flex-row jm:items-center md:justify-between">
       <div className="w-full md:w-[456px] relative mr-4 flex h-12 items-center justify-between border-b border-[rgba(255,255,255,0.2)] pr-8 jm:ml-0">
       <div className="mr-0 w-full max-w-full flex-1 text-base truncate leading-6 text-[#d6d6d6] md:mr-0">
          {address}
        </div>
        {isVerify && (
          <Image
            src="/icons/sign.svg"
            width={20}
            height={20}
            alt="sign"
            className="absolute right-0 top-[10px] cursor-pointer jm:top-[14px]"
          />
        )}
      </div>
      <div className="w-full md:w-[270px] md:min-w-[270px] flex flex-row-reverse md:flex-row justify-between md:justify-start">
      <div className="mt-4  ml-[20px] md:ml-0 flex h-12 w-12 min-w-12 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] md:mt-0">
          <Image
            onClick={handleAdd}
            className="cursor-pointer"
            src="/icons/add-qua.svg"
            width={48}
            height={49}
            alt="add"
          />
        </div>
        <ConnectBtn
          handleConnect={handleConnect}
          handleDisconnect={handleDisconnect}
          isConnect={!!connectAddress && connectAddress === address}
        />
      </div>
    </div>
  );
}
