import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InputWithClear } from "./input-with-clear";
import { isAddress } from "viem";
import fetcher from "@/lib/fetcher";
import { useAtomValue } from "jotai/react";
import { UuidAtom } from "@/lib/state";
import { ApiHost } from "@/lib/path";
import { useLang } from "@/lib/use-lang";
import { useFetchUserInfo } from "@/lib/use-fetch-user-info";

const Chains = [
  "OP Mainnet",
  "BNB Chain",
  "Solana",
  "Ethereum",
  "Sui",
  "Blast",
  "Base",
  "Arbitrum",
  "Polygon",
  "Ronin",
];

const LogoMap: Record<string, string> = {
  "OP Mainnet": "./icons/op.svg",
  "BNB Chain": "./icons/bnb.svg",
  Solana: "./icons/solana.svg",
  Ethereum: "./icons/ethereum.svg",
  Sui: "./icons/sui.svg",
  Blast: "./icons/blast.svg",
  Base: "./icons/base.svg",
  Arbitrum: "./icons/arb.svg",
  Polygon: "./icons/polygon.svg",
  Ronin: "./icons/ronin.svg",
};

export interface IWallet {
  name: string;
  address: string;
  isSign: boolean;
}

export function WalletArray({
  wArr,
  setWArr,
}: {
  wArr: Array<IWallet>;
  setWArr: (_w: IWallet[]) => void;
}) {
  const { isEn } = useLang();
  const handleNameChange = (index: number, value: string) => {
    const updatedPeople = [...wArr];
    updatedPeople[index].name = value;
    setWArr(updatedPeople);
  };

  const handleAddrChange = (index: number, value: string) => {
    const updatedPeople = [...wArr];
    updatedPeople[index].address = value;
    setWArr(updatedPeople);
  };

  const handleSignChange = (index: number, value: boolean) => {
    const updatedPeople = [...wArr];
    updatedPeople[index].isSign = value;
    setWArr(updatedPeople);
  };

  const addWallet = () => {
    setWArr([...wArr, { name: "", address: "", isSign: false }]);
  };

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
          />
        ))}
      </div>
    </div>
  );
}

function WalletItem({
  name,
  address,
  isSign,
  setIsSign,
}: {
  name: string;
  address: string;
  isSign: boolean;
  setName: (_n: string) => void;
  setAddress: (_a: string) => void;
  setIsSign: (_i: boolean) => void;
}) {
  const uuid = useAtomValue(UuidAtom);
  const [walletName, setWalletName] = useState(name);
  const [walletAddress, setWalletAddress] = useState(address);

  const [popOpen, setPopOpen] = useState(false);

  const [isValid, setIsValid] = useState(true);

  const { getUserInfo } = useFetchUserInfo();

  const disabled = useMemo(
    () => !walletName || !walletAddress || !isValid || isSign,
    [walletName, walletAddress, isValid, isSign],
  );

  function handleValueChange(v: string) {
    if (!v) {
      setIsValid(true);
    }
    if (walletName !== "Solana") {
      setIsValid(isAddress(v));
    } else {
      const solanaAddressRegex = /^([1-9A-HJ-NP-Za-km-z]{32,44})$/;
      setIsValid(solanaAddressRegex.test(v));
    }
    setWalletAddress(v);
  }

  function handleSave() {
    if (disabled) return;
    saveWallet();
    getUserInfo();
  }

  async function saveWallet() {
    const res: any = await fetcher(`${ApiHost}/wallet/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chain_name: walletName,
        wallet_address: walletAddress,
        signature: "",
        user_id: uuid,
      }),
    });
    console.log(res);

    setIsSign(true);
  }

  return (
    <div className="mt-6 flex items-center">
      <Popover open={popOpen} onOpenChange={(isOpen) => setPopOpen(isOpen)}>
        <PopoverTrigger asChild>
          <div
            onClick={() => setPopOpen(!popOpen)}
            className="flex h-12 w-[200px] items-center justify-between border-b border-solid border-[#515151]"
          >
            <div className="flex items-center">
              {LogoMap[walletName] ? (
                <Image
                  src={LogoMap[walletName]}
                  width={30}
                  height={30}
                  alt="wallet"
                />
              ) : (
                <div className="h-[30px] w-[30px] rounded-full bg-slate-400"></div>
              )}
              <div className="ml-3 leading-6 text-[#d6d6d6]">{walletName}</div>
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
          {Chains.map((c) => (
            <div
              key={c}
              className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] hover:brightness-75"
              onClick={() => {
                setWalletName(c);
                setPopOpen(false);
              }}
            >
              <Image src={LogoMap[c]} width={30} height={30} alt="wallet" />
              <div className="ml-3 leading-6 text-[#d6d6d6]">{c}</div>
            </div>
          ))}
        </PopoverContent>
      </Popover>
      <InputWithClear
        isError={!isValid}
        value={walletAddress}
        onValueChange={(v) => handleValueChange(v)}
        isSign={isSign}
        conClass="ml-4 flex-1"
      />
      <div
        onClick={handleSave}
        data-disabled={disabled}
        className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed  data-[disabled=true]:opacity-50"
      >
        <Image src="./icons/save.svg" width={24} height={24} alt="save" />
      </div>
    </div>
  );
}
