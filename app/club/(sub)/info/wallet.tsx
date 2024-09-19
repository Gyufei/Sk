import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/lib/use-lang";
import { ChainInfos } from "@/lib/const";
import { WalletItem } from "./wallet-items";
import { useFetchUserInfo } from "@/lib/use-fetch-user-info";

export interface IWallet {
  name: string;
  address: string;
  isSign: boolean;
}

export function WalletArray() {
  const { isEn } = useLang();
  const { data: userInfo } = useFetchUserInfo();

  const [wArr, setWArr] = useState<any[]>([]);

  const userWallets = useMemo(() => {
    if (!userInfo?.wallets) return [];
    const userWallets = userInfo.wallets;
    const mainWallet = userWallets.main_wallet;
    const altWallets = userWallets.alt_wallets;
    const userAltWallets = altWallets.map((w: any, index: number) => {
      return {
        name: w.network,
        address: w.address,
        isSign: true,
        serial_number: index + 2,
      };
    });

    const wallets = [
      {
        name: "OP Mainnet",
        address: mainWallet,
        isSign: true,
        serial_number: 1,
      },
      ...userAltWallets,
    ];

    return wallets;
  }, [userInfo?.wallets]);

  useEffect(() => {
    const uniqArr = (userWallets || []).map(
      (w: any) => w.address + " " + w.name,
    );
    const arrWallet = wArr.filter(
      (w) => !uniqArr.includes(w.address + " " + w.name),
    );
    setWArr([...userWallets, ...arrWallet]);
  }, [userWallets]);

  const handleNameChange = (index: number, value: string) => {
    setWArr((prev) => {
      const updatedPeople = [...prev];
      updatedPeople[index].name = value;
      return updatedPeople;
    });
  };

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

  const addWallet = () => {
    setWArr((prev) => [...prev, { name: "", address: "", isSign: false }]);
  };

  const removeWallet = (index: number) => {
    setWArr((prev) => {
      const updatedPeople = [...prev];
      updatedPeople.splice(index, 1);
      return updatedPeople;
    });
  };

  const walletOptions = useMemo(() => {
    const allWalletsInfo = Object.keys(ChainInfos);
    const walletShowNum: any = {};
    for (const w of wArr) {
      if (walletShowNum[w.name]) {
        walletShowNum[w.name] += 1;
      } else {
        walletShowNum[w.name] = 1;
      }
    }

    return allWalletsInfo.filter((w) => {
      return !walletShowNum[w] || walletShowNum[w] < 5;
    });
  }, [wArr]);

  return (
    <div className="relative mt-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur md:rounded-[18px] md:p-[20px]">
      <div className="flex items-center justify-between space-x-[10px] md:justify-start">
        <div className="text-xl leading-[30px]">
          {isEn ? "Wallets" : "钱包"}
        </div>
        <Image
          onClick={addWallet}
          className="cursor-pointer"
          src="/icons/add.svg"
          width={30}
          height={30}
          alt="add"
        />
      </div>
      <div>
        {wArr.map((item, index) => (
          <WalletItem
            key={index}
            name={item.name}
            address={item.address}
            isSign={item.isSign}
            serialNumber={item.serial_number}
            setName={(value) => handleNameChange(index, value)}
            setAddress={(value) => handleAddrChange(index, value)}
            setIsSign={(value) => handleSignChange(index, value)}
            walletOptions={walletOptions}
            handleRemove={() => {
              removeWallet(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
