import Image from "next/image";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const Chains = ["OP Mainnet", "BNB Chain"];

const LogoMap: Record<string, string> = {
  "OP Mainnet": "./icons/op.svg",
  "BNB Chain": "./icons/bnb.svg",
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

  const addPerson = () => {
    setWArr([...wArr, { name: "", address: "", isSign: false }]);
  };

  return (
    <div className="mt-10">
      <div className="flex items-center space-x-[10px]">
        <div className="text-xl leading-[30px]">Wallets</div>
        <Image
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
  setName,
  setAddress,
  setIsSign,
}: {
  name: string;
  address: string;
  isSign: boolean;
  setName: (_n: string) => void;
  setAddress: (_a: string) => void;
  setIsSign: (_i: boolean) => void;
}) {
  const [walletName, setWalletName] = useState(name);
  const [walletAddress, setWalletAddress] = useState(address);

  const [popOpen, setPopOpen] = useState(false);

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
        <PopoverContent className="flex w-[200px] flex-col items-stretch space-y-2 border-none bg-[#262626] p-4">
          {Chains.map((c) => (
            <div
              key={c}
              className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] hover:brightness-75"
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
      <div className="relative ml-4 flex-1">
        <Input
          value={walletAddress}
          onChange={(e: any) => setWalletAddress(e.target.value)}
          className="h-12 rounded-none border-b border-[rgba(255,255,255,0.2)] bg-transparent text-[#d6d6d6]"
        />
        {isSign && (
          <Image
            src="./icons/sign.svg"
            width={20}
            height={20}
            alt="sign"
            className="absolute right-0"
          />
        )}
      </div>
    </div>
  );
}
