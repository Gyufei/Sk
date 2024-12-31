import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useWalletVerify } from "@/lib/api/use-wallet-verify";
import { useRemoveWallet } from "@/lib/api/use-remove-wallet";
import { ConnectBtn } from "./connect-btn";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function SolWalletItem({
  listLength,
  address,
  setAddress,
  isVerify,
  isSign,
  handleRemove,
  serialNumber,
}: {
  listLength: number;
  address: string;
  isVerify: boolean;
  isSign: boolean;
  serialNumber: number;
  setAddress: (_a: string) => void;
  handleRemove: () => void;
}) {
  const { publicKey, disconnect } = useWallet();
  const connectAddress = useMemo(
    () => (publicKey ? publicKey.toBase58() : ""),
    [publicKey],
  );

  const { setVisible: solanaModalOpen } = useWalletModal();
  const { getUserInfo } = useFetchUserInfo();
  const { walletVerify } = useWalletVerify();
  const { trigger: removeWalletAction, isMutating } = useRemoveWallet();

  const [isWaitingForNewConnect, setIsWaitingForNewConnect] = useState(false);
  const [isOperating, setIsOperating] = useState(false);

  useEffect(() => {
    if (!isWaitingForNewConnect || !connectAddress) return;
    if (connectAddress === address) {
      return;
    }

    verifyWallet();
  }, [isWaitingForNewConnect, connectAddress, address]);

  async function handleConnect() {
    if (isOperating) return;
    setIsOperating(true);
    await disconnect();
    setIsWaitingForNewConnect(true);
    solanaModalOpen(true);
    setIsOperating(false);
  }

  async function handleDisconnect() {
    if (isOperating) return;
    setIsOperating(true);
    await disconnect();
    setIsOperating(false);
  }

  async function verifyWallet() {
    if (!connectAddress) {
      solanaModalOpen(true);
    } else {
      const res = await walletVerify({
        chain_name: "Solana",
        addr: connectAddress!,
        signature: "",
        salt: "",
      });

      if (res) {
        setAddress(connectAddress);
        setIsWaitingForNewConnect(false);
        getUserInfo();
      }
    }
  }

  async function removeWallet() {
    if (isMutating) return;
    if (isSign === false) { // no sign Data 
      handleRemove();
      return
    }
    const res: any = await removeWalletAction({
      chainName: "Solana",
      serialNumber,
    });

    if (res.status) {
      handleRemove();
    }
  }

  return (
    <div className="mb-6 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
       <div className="w-full sm:w-[456px] relative mr-4 flex h-12 items-center justify-between border-b border-[rgba(255,255,255,0.2)] pr-8 sm:ml-0">
        <div className="mr-0 w-full max-w-full flex-1 text-base truncate leading-6 text-[#d6d6d6] sm:mr-0">
          {address}
        </div>
        {isVerify && (
          <Image
            src="/icons/sign.svg"
            width={20}
            height={20}
            alt="sign"
            className="absolute right-0 top-[10px] cursor-pointer sm:top-[14px]"
          />
        )}
      </div>
      <div className="w-full sm:w-[270px] sm:min-w-[270px] flex flex-row-reverse justify-between">
       {
          (listLength > 1 && serialNumber > 0 || isSign===false) ? (
            <div className="mt-4  ml-[24px] flex h-12 w-12 min-w-12 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] sm:mt-0">
              <Image
                onClick={removeWallet}
                className="cursor-pointer opacity-60"
                src="/icons/close-2.svg"
                width={48}
                height={49}
                alt="delete"
              />
            </div>
          ) : (
            <div className="sm:w-12 sm:ml-[24px]"></div>
          )
        }
        <ConnectBtn
          handleConnect={handleConnect}
          handleDisconnect={handleDisconnect}
          isConnect={!!connectAddress && connectAddress === address}
        />
      </div>
    </div>
  );
}
