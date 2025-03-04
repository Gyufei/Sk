import Image from "next/image";
import { EthChainInfos } from "@/lib/const";

import { useEffect, useMemo, useState } from "react";
import { WalletItem } from "./wallet-item";
import { useChainId, useSwitchChain } from "wagmi";
import { PopDrawer } from "@/components/pop-drawer";
import useEthWallet from "./use-eth-wallet";


export function EthWallets() {
  const chainId = useChainId();

  const [popOpen, setPopOpen] = useState(false);
  const [selectedChainName, setSelectedChainName] = useState("");
  const { switchChain } = useSwitchChain()
  const {
    isLoginAddress,
    walletList,
    connectAddress,
    handleAddWallet,
    handleRemoveWallet,
    handleDisconnect,
    handleConnect,
  } = useEthWallet();


  const walletOptions = useMemo(() => {
    const allWalletsInfo = Object.keys(EthChainInfos);
    return allWalletsInfo as (keyof typeof EthChainInfos)[];
  }, []);


  useEffect(() => {
    if (chainId) {
      const targetChain = Object.values(EthChainInfos).find(
        (c) => c.chainId === chainId
      );
      setSelectedChainName(targetChain?.name || "");
    }
  }, [chainId]);

  const handleChangeChain = (cName: string, cChainId: number | undefined) => {
    setSelectedChainName(cName);
    setPopOpen(false);
    switchChain({
      chainId: cChainId as number
    });
  };


  return (
    <>
      <div className="flex align-items justify-between sm:justify-start">
        <PopDrawer
            title= {"Wallets"}
            open={popOpen} 
            onOpenChange={(isOpen) => setPopOpen(isOpen)}
            popContentClass={'h-[300px] w-[200px]'}
            triggerProps={{
              'data-disabled': false,
              'className': "data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed"
            }}
            popContent={walletOptions.map((c) => (
              <div
                key={c}
                className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] hover:brightness-75"
                onClick={() => handleChangeChain(c, EthChainInfos[c].chainId)}
              >
                <Image
                  src={EthChainInfos[c].logo}
                  width={30}
                  height={30}
                  alt="wallet"
                />
                <div className="ml-3 text-base leading-6 text-[#d6d6d6]">{c}</div>
              </div>
            ))}
          >
            <div
              onClick={() => setPopOpen(!popOpen)}
              className="flex h-12 w-[200px] items-center justify-between border-0 border-solid border-[#515151] cursor-pointer"
            >
              <div className="flex items-center">
                {EthChainInfos[selectedChainName as keyof typeof EthChainInfos] ? (
                  <Image
                    src={EthChainInfos[selectedChainName as keyof typeof EthChainInfos].logo}
                    width={30}
                    height={30}
                    alt="wallet"
                  />
                ) : (
                  <div className="h-[30px] w-[30px] rounded-full bg-slate-400"></div>
                )}
                <div className="ml-3 text-base leading-6 text-[#d6d6d6]">
                  EVM {selectedChainName ? `(${selectedChainName})` : ""}
                </div>
              </div>
              <Image
                data-open={popOpen}
                src="/icons/arrow-down.svg"
                width={24}
                height={24}
                alt="down"
                className="data-[open=true]:rotate-180"
              />
            </div>
        </PopDrawer>
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
