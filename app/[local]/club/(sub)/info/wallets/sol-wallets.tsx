import Image from "next/image";
import { SolanaChainInfos } from "@/lib/const";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useMemo, useState } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { SolWalletItem } from "./sol-wallet-item";

export function SolWallets() {
  const { data: userInfo } = useFetchUserInfo();

  const [currentChainName, setCurrentChainName] = useState("Solana");
  const [popOpen, setPopOpen] = useState(false);

  const walletOptions = useMemo(() => {
    const allWalletsInfo = Object.keys(SolanaChainInfos);
    return allWalletsInfo;
  }, []);

  const [wArr, setWArr] = useState<any[]>([]);

  useEffect(() => {
    if (!userInfo?.wallets?.Solana?.length) {
      setWArr([
        {
          address: "",
          isSign: false,
          serial_number: 1,
        },
      ]);
      return;
    }

    const solWallets = userInfo.wallets.Solana;
    const wallets = solWallets.map((w: any, index: number) => {
      return {
        address: w,
        isVerify: true,
        serial_number: index + 2,
      };
    });
    setWArr(wallets);
  }, [userInfo]);

  const handleAddrChange = (index: number, value: string) => {
    setWArr((prev) => {
      const updatedPeople = [...prev];
      updatedPeople[index].address = value;
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
            {/* <Image
              data-open={popOpen}
              src="/icons/arrow-down.svg"
              width={24}
              height={24}
              alt="down"
              className="data-[open=true]:rotate-180"
            /> */}
          </div>
        </PopoverTrigger>
        <PopoverContent className="no-scroll-bar flex h-[80px] w-[200px] flex-col items-stretch space-y-2 overflow-y-auto border-none bg-[#262626] p-4">
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
                src={SolanaChainInfos[c].logo}
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
          <SolWalletItem
            key={index}
            address={item.address}
            isVerify={item.isVerify}
            serialNumber={item.serial_number}
            setAddress={(value) => handleAddrChange(index, value)}
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
