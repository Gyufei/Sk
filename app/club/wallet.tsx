import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import fetcher from "@/lib/fetcher";
import { useAtomValue } from "jotai/react";
import { UserInfoAtom, UuidAtom } from "@/lib/state";
import { ApiHost } from "@/lib/path";
import { useLang } from "@/lib/use-lang";
import { useFetchUserInfo } from "@/lib/use-fetch-user-info";
import { useAccount } from "wagmi";

const ChainInfos: Record<string, any> = {
  "OP Mainnet": {
    logo: "./images/network-icons/op.svg",
    isEVM: true,
  },
  "BNB Chain": {
    logo: "./images/network-icons/bnb.svg",
    isEVM: true,
  },
  Solana: {
    logo: "./images/network-icons/solana.svg",
    isEVM: false,
  },
  Ethereum: {
    logo: "./images/network-icons/ethereum.svg",
    isEVM: true,
  },
  Sui: {
    logo: "./images/network-icons/sui.svg",
  },
  Blast: {
    logo: "./images/network-icons/blast.svg",
  },
  Base: {
    logo: "./images/network-icons/base.svg",
  },
  Arbitrum: {
    logo: "./images/network-icons/arb.svg",
    isEVM: true,
  },
  Polygon: {
    logo: "./images/network-icons/polygon.svg",
    isEVM: true,
  },
  Ronin: {
    logo: "./images/network-icons/ronin.svg",
  },
};

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

function WalletItem({
  name,
  address,
  setName,
  setAddress,
  isSign,
  setIsSign,
  isLastEvm = false,
  walletOptions,
  handleRemove,
}: {
  name: string;
  address: string;
  isSign: boolean;
  setName: (_n: string) => void;
  setAddress: (_a: string) => void;
  setIsSign: (_i: boolean) => void;
  isLastEvm?: boolean;
  walletOptions: any[];
  handleRemove: () => void;
}) {
  const uuid = useAtomValue(UuidAtom);
  const [popOpen, setPopOpen] = useState(false);
  const { getUserInfo } = useFetchUserInfo();
  const { address: walletAddress } = useAccount();

  const disabled = useMemo(() => {
    if (isSign) {
      return false;
    }
    return !name;
  }, [name, isSign]);

  // function handleValueChange(v: string) {
  //   setAddress(v);
  // }

  async function handleOperation() {
    if (disabled) return;
    if (!isSign) {
      await linkWallet();
    } else {
      await removeWallet();
    }
    getUserInfo();
  }

  async function linkWallet() {
    if (ChainInfos[name]?.isEVM) {
      await saveWalletAction(walletAddress || "");
    } else {
      return;
    }
  }

  async function saveWalletAction(addr: string) {
    if (!addr) return;
    setAddress(addr);
    const res: any = await fetcher(`${ApiHost}/wallet/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chain_name: name,
        wallet_address: addr,
        signature: "",
        user_id: uuid,
      }),
    });
    console.log(res);

    setIsSign(true);
  }

  async function removeWallet() {
    const res: any = await fetcher(`${ApiHost}/wallet/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        chain_name: name,
      }),
    });

    console.log(res);
    handleRemove();
  }

  return (
    <div className="mt-6 flex items-center">
      <Popover open={popOpen} onOpenChange={(isOpen) => setPopOpen(isOpen)}>
        <PopoverTrigger
          asChild
          data-disabled={isLastEvm}
          className="data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed"
        >
          <div
            onClick={() => setPopOpen(!popOpen)}
            className="flex h-12 w-[200px] items-center justify-between border-b border-solid border-[#515151]"
          >
            <div className="flex items-center">
              {ChainInfos[name] ? (
                <Image
                  src={ChainInfos[name].logo}
                  width={30}
                  height={30}
                  alt="wallet"
                />
              ) : (
                <div className="h-[30px] w-[30px] rounded-full bg-slate-400"></div>
              )}
              <div className="ml-3 text-base leading-6 text-[#d6d6d6]">
                {name}
              </div>
            </div>
            <Image
              data-open={popOpen}
              src="./icons/arrow-down.svg"
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
                setName(c);
                setPopOpen(false);
              }}
            >
              <Image
                src={ChainInfos[c].logo}
                width={30}
                height={30}
                alt="wallet"
              />
              <div className="ml-3 text-base leading-6 text-[#d6d6d6]">{c}</div>
            </div>
          ))}
        </PopoverContent>
      </Popover>
      <div className="relative ml-4 flex h-12 flex-1 items-center border-b border-[rgba(255,255,255,0.2)] ">
        <div className="text-base leading-6 text-[#d6d6d6]">{address}</div>
        {isSign && (
          <Image
            src="./icons/sign.svg"
            width={20}
            height={20}
            alt="sign"
            className="absolute right-0 top-[14px] cursor-pointer"
          />
        )}
      </div>
      {!isLastEvm && (
        <div
          onClick={handleOperation}
          data-disabled={disabled}
          className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed  data-[disabled=true]:opacity-50"
        >
          {isSign ? (
            <Image src="./icons/unlink.svg" width={24} height={24} alt="save" />
          ) : (
            <Image src="./icons/link.svg" width={24} height={24} alt="save" />
          )}
        </div>
      )}
    </div>
  );
}
