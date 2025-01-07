import Image from "next/image";
import { SolanaChainInfos } from "@/lib/const";
import { useState } from "react";
import useSolWallet from "./use-sol-wallet";
import { WalletItem } from "./wallet-item";

export function SolWallets() {
  const [currentChainName] = useState("Solana");

  const {
    isLoginAddress,
    walletList,
    connectAddress,
    handleAddWallet,
    handleRemoveWallet,
    handleDisconnect,
    handleConnect,
  } = useSolWallet();

  return (
    <>
      <div className="flex h-12 justify-between sm:justify-start items-center border-0 border-solid border-[#515151]">
        <div className="w-[200px] flex items-center">
          {SolanaChainInfos[currentChainName] ? (
            <Image
              src={SolanaChainInfos[currentChainName].logo}
              width={30}
              height={30}
              alt="wallet"
            />
          ) : (
            <div className="h-[30px] w-[30px] rounded-full bg-slate-400"></div>
          )}
          <div className="ml-3 text-base leading-6 text-[#d6d6d6]">
            {currentChainName}
          </div>
        </div>
        {
          (walletList.length > 0 && !isLoginAddress) && (
            <Image
              onClick={handleAddWallet}
              className="cursor-pointer ml-[22px]"
              src="/icons/add-circle.svg"
              width={24}
              height={24}
              alt="add"
            />
          )
        }
      </div>
      <div className="mt-2">
        {walletList.map((address: string, index: number) => (
          <WalletItem
            key={index}
            addressIndex={index}
            address={address}
            connectAddress={connectAddress}
            handleRemove={handleRemoveWallet}
            handleDisconnect={handleDisconnect}
            handleConnect={handleConnect}
          />
        ))}
        {
          walletList.length === 0 && (
            <WalletItem
              addressIndex={-1}
              address={''}
              connectAddress={connectAddress}
              handleAdd={handleAddWallet}
            />
          )
        }
      </div>
    </>
  );
}
