import Image from "next/image";
import { SolanaChainInfos } from "@/lib/const";
import { useEffect, useState } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { SolWalletItem } from "./sol-wallet-item";

export function SolWallets() {
  const { data: userInfo } = useFetchUserInfo();

  const [currentChainName] = useState("Solana");

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
      <div className="flex h-12 w-[200px] items-center justify-between border-0 border-solid border-[#515151]">
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
      </div>
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
