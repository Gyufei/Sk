import Image from "next/image";
import { SolanaChainInfos } from "@/lib/const";
import { useContext, useEffect, useMemo, useState } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { SolWalletItem } from "./sol-wallet-item";
import { GlobalMsgContext } from "@/components/global-msg-context";
import { useTranslations } from "next-intl";

export function SolWallets() {
  const { data: userInfo } = useFetchUserInfo();

  const [currentChainName] = useState("Solana");

  const [wArr, setWArr] = useState<any[]>([]);
  const T = useTranslations("Common");
  const { setGlobalMessage } = useContext(GlobalMsgContext);

  const listLength = useMemo(() => {
    return wArr.filter((item) => item.isSign !== false).length
  }, [wArr])

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
        serial_number: index,
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
    if (wArr.length >=5) {
      setGlobalMessage({
        type: "error",
        message: T("MaxWalletMsg"),
      });
      return;
    }
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
      <div className="flex h-12 items-center border-0 border-solid border-[#515151]">
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
         <Image
          onClick={handleAddWallet}
          className="cursor-pointer ml-[22px]"
          src="/icons/add-circle.svg"
          width={24}
          height={24}
          alt="add"
        />
      </div>
      <div className="mt-2">
        {wArr.map((item, index) => (
          <SolWalletItem
            listLength={listLength}
            key={index}
            address={item.address}
            isVerify={item.isVerify}
            isSign={item.isSign}
            serialNumber={item.serial_number}
            setAddress={(value) => handleAddrChange(index, value)}
            handleRemove={() => {
              handleRemove(index);
            }}
          />
        ))}
      </div>
    </>
  );
}
