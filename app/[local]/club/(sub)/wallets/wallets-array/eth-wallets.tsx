import Image from "next/image";
import { EthChainInfos } from "@/lib/const";

import { useContext, useEffect, useMemo, useState } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { EthWalletItem } from "./eth-wallet-item";
import { useChainId, useSwitchChain } from "wagmi";
import { PopDrawer } from "@/components/pop-drawer";
import { GlobalMsgContext } from "@/components/global-msg-context";
import { useTranslations } from "next-intl";

export function EthWallets() {
  const chainId = useChainId();
  const T = useTranslations("Common");
  const { data: userInfo } = useFetchUserInfo();

  const [popOpen, setPopOpen] = useState(false);
  const [selectedChainName, setSelectedChainName] = useState("");
  const { switchChain } = useSwitchChain()
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const currChainInfo = useMemo(() => {
    const currChain = Object.values(EthChainInfos).find(
      (c) => c.name === selectedChainName,
    );
    return currChain;
  }, [selectedChainName]);

  const walletOptions = useMemo(() => {
    const allWalletsInfo = Object.keys(EthChainInfos);
    return allWalletsInfo;
  }, []);

  const [wArr, setWArr] = useState<any[]>([]);

  const listLength = useMemo(() => {
    return wArr.filter((item) => item.isSign !== false).length
  }, [wArr])

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
        isVerify: true,
        serial_number: index,
      };
    });
    setWArr(wallets);
  }, [userInfo]);

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

  const handleAddrChange = (index: number, value: string) => {
    setWArr((prev) => {
      const updatedPeople = [...prev];
      if (updatedPeople[index].isSign === false) {
        updatedPeople[index].address = value;
        updatedPeople[index].isSign = undefined;
      } else {
        const _index = updatedPeople.findIndex((item) => item.isSign === false)
        if (_index > -1) {
          updatedPeople[_index].address = value;
          updatedPeople[_index].isSign = undefined;
        }
      }
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
                {EthChainInfos[selectedChainName] ? (
                  <Image
                    src={EthChainInfos[selectedChainName].logo}
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
          <EthWalletItem
            key={index}
            listLength={listLength}
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
