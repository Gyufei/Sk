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
  listLength,
  address,
  isVerify,
  isSign,
  setAddress,
  handleRemove,
  serialNumber,
}: {
  listLength: number;
  address: string;
  isVerify: boolean;
  isSign: boolean;
  serialNumber: number;
  setAddress: (_a: string) => void;
  handleRemove: () => void;
}) {
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const { address: connectAddress } = useAccount();
  const { openConnectModal = () => {}} = useConnectModal();
  const { openChainModal = () => {} } = useChainModal();

  const { disconnectAsync: disconnect, isPending: isDisconnecting } =
    useDisconnect();
  const { data: userInfo, getUserInfo } = useFetchUserInfo();
  const { walletVerify } = useWalletVerify();
  const { trigger: removeWalletAction, isMutating } = useRemoveWallet();

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

  async function removeWallet() {
    if (address === userInfo?.login_data?.wallet_address) {
      setGlobalMessage({
        type: "error",
        message: "You cannot delete the wallet that is being logged in.",
      });
      return;
    }
    if (isMutating) return;
    if (isSign === false) { // no sign Data 
      handleRemove();
      return
    }
    const res: any = await removeWalletAction({
      chainName: "EVM",
      serialNumber,
    });

    if (res.status) {
      handleRemove();
    }
  }
  

  return (
    <div className="mb-6 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
       <div className="w-full sm:w-[456px] relative mr-4 flex h-12 items-center justify-between border-b border-[rgba(255,255,255,0.2)] pr-8 sm:ml-0">
       <div className="mr-0 w-full max-w-full flex-1 text-base truncate leading-6 text-[#d6d6d6] sm:mr-0">
          {address}
        </div>
        {isVerify && (
          <Image
            src="/icons/sign.svg"
            width={20}
            height={20}
            alt="sign"
            className="absolute right-0 top-[10px] cursor-pointer sm:top-[14px]"
          />
        )}
      </div>
      <div className="w-full sm:w-[270px] sm:min-w-[270px] flex flex-row-reverse justify-between">
        {
          (listLength > 1 || isSign===false) ? (
            <div className="mt-4  ml-[24px] flex h-12 w-12 min-w-12 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] sm:mt-0">
              <Image
                onClick={removeWallet}
                className="cursor-pointer opacity-60"
                src="/icons/close-2.svg"
                width={48}
                height={49}
                alt="delete"
              />
            </div>
          ) : (
            <div className="sm:w-12 sm:ml-[24px]"></div>
          )
        }
        
        <ConnectBtn
          handleConnect={handleConnect}
          handleDisconnect={handleDisconnect}
          isConnect={!!connectAddress && connectAddress === address}
        />
      </div>
    </div>
  );
}
