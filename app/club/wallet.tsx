import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai/react";
import { UserInfoAtom } from "@/lib/state";
import { useLang } from "@/lib/use-lang";
import { ChainInfos } from "@/lib/const";
import { WalletItem } from "./wallet-items";

export interface IWallet {
  name: string;
  address: string;
  isSign: boolean;
}

export function WalletArray() {
  const { isEn } = useLang();
  const userInfo = useAtomValue(UserInfoAtom);

  const [wArr, setWArr] = useState<any[]>([]);

  useEffect(() => {
    const wallets = Object.entries(userInfo?.wallets || {}).map((w: any) => ({
      name: w[0],
      address: w[1],
      isSign: true,
    }));

    const uniqArr = wallets.map((w) => w.address + " " + w.name);
    const arrWallet = wArr.filter(
      (w) => !uniqArr.includes(w.address + " " + w.name),
    );
    setWArr([...wallets, ...arrWallet]);
  }, [userInfo?.wallets]);

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

  const onlyEvm = useMemo(() => {
    let evmNum = 0;

    for (const c of wArr) {
      if (!c.isSign) continue;
      const isEvm = ChainInfos[c.name]?.isEVM;
      evmNum += isEvm ? 1 : 0;
    }

    return evmNum === 1;
  }, [wArr]);

  const walletOptions = useMemo(
    () =>
      Object.keys(ChainInfos).filter((c) => wArr.every((w) => w.name !== c)),
    [wArr],
  );

  return (
    <div className="mt-10">
      <div className="flex items-center space-x-[10px]">
        <div className="text-xl leading-[30px]">
          {isEn ? "Wallets" : "钱包"}
        </div>
        <Image
          onClick={addWallet}
          className="cursor-pointer"
          src="./icons/add.svg"
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
            setName={(value) => handleNameChange(index, value)}
            setAddress={(value) => handleAddrChange(index, value)}
            setIsSign={(value) => handleSignChange(index, value)}
            isLastEvm={item.isSign && ChainInfos[item.name]?.isEVM && onlyEvm}
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
