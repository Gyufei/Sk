import Image from "next/image";
import { EthChainInfos } from "@/lib/const";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useMemo, useState } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { EthWalletItem } from "./eth-wallet-item";
import { useChainId, useSwitchNetwork } from "wagmi";

export function EthWallets() {
  const { data: userInfo } = useFetchUserInfo();
  const chainId = useChainId();
  const { switchNetwork } = useSwitchNetwork();

  const [currentChainName, setCurrentChainName] = useState("");
  const [popOpen, setPopOpen] = useState(false);

  const walletOptions = useMemo(() => {
    const allWalletsInfo = Object.keys(EthChainInfos);
    return allWalletsInfo;
  }, []);

  const [wArr, setWArr] = useState<any[]>([]);

  useEffect(() => {
    if (!userInfo?.wallets?.EVM.length) {
      setWArr([
        {
          address: "",
          isSign: false,
          serial_number: 1,
        },
      ]);
      return;
    }

    const evmWallets = userInfo.wallets.EVM;
    const wallets = evmWallets.map((w: any, index: number) => {
      return {
        address: w,
        isSign: true,
        serial_number: index + 2,
      };
    });
    setWArr(wallets);
  }, [userInfo]);

  const [switchChainDelay, setSwitchChainDelay] = useState(false);

  useEffect(() => {
    if (chainId && !switchChainDelay) {
      setSwitchChainDelay(true);
      const currChain = Object.values(EthChainInfos).find(
        (c) => c.chainId === chainId,
      );

      setCurrentChainName(currChain?.name || "");

      setTimeout(() => {
        setSwitchChainDelay(false);
      }, 2000);
    }
  }, [chainId]);

  useEffect(() => {
    const currChain = Object.values(EthChainInfos).find(
      (c) => c.name === currentChainName,
    );

    const currChainId = currChain?.chainId;

    if (currChainId && chainId !== currChainId) {
      switchNetwork && switchNetwork(currChainId);
    }

    const timer = setTimeout(() => {
      setSwitchChainDelay(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [currentChainName, chainId]);

  const handleAddrChange = (index: number, value: string) => {
    setWArr((prev) => {
      const updatedPeople = [...prev];
      updatedPeople[index].address = value;
      return updatedPeople;
    });
  };

  const handleSignChange = (index: number, value: boolean) => {
    setWArr((prev) => {
      const updatedPeople = [...prev];
      updatedPeople[index].isSign = value;
      return updatedPeople;
    });
  };

  const handleAddWallet = () => {
    setWArr((prev) => [...prev, { name: "", address: "", isSign: false }]);
  };

  const handleRemove = (index: number) => {
    setWArr((prev) => {
      const updatedPeople = [...prev];
      updatedPeople.splice(index, 1);
      return updatedPeople;
    });
  };

  return (
    <>
      <Popover open={popOpen} onOpenChange={(isOpen) => setPopOpen(isOpen)}>
        <PopoverTrigger
          asChild
          data-disabled={false}
          className="data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed"
        >
          <div
            onClick={() => setPopOpen(!popOpen)}
            className="flex h-12 w-[200px] items-center justify-between border-0 border-solid border-[#515151]"
          >
            <div className="flex items-center">
              {EthChainInfos[currentChainName] ? (
                <Image
                  src={EthChainInfos[currentChainName].logo}
                  width={30}
                  height={30}
                  alt="wallet"
                />
              ) : (
                <div className="h-[30px] w-[30px] rounded-full bg-slate-400"></div>
              )}
              <div className="ml-3 text-base leading-6 text-[#d6d6d6]">
                EVM {currentChainName ? `(${currentChainName})` : ""}
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
        </PopoverTrigger>
        <PopoverContent className="no-scroll-bar flex h-[300px] w-[200px] flex-col items-stretch space-y-2 overflow-y-auto border-none bg-[#262626] p-4">
          {walletOptions.map((c) => (
            <div
              key={c}
              className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] hover:brightness-75"
              onClick={() => {
                setCurrentChainName(c);
                setPopOpen(false);
              }}
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
        </PopoverContent>
      </Popover>
      <div className="mt-2">
        {wArr.map((item, index) => (
          <EthWalletItem
            key={index}
            address={item.address}
            isSign={item.isSign}
            serialNumber={item.serial_number}
            setAddress={(value) => handleAddrChange(index, value)}
            setIsSign={(value) => handleSignChange(index, value)}
            handleRemove={() => {
              handleRemove(index);
            }}
            handleAdd={handleAddWallet}
          />
        ))}
      </div>
    </>
  );
}
