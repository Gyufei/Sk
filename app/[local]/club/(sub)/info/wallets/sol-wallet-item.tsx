import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useWalletVerify } from "@/lib/api/use-wallet-verify";
import { cn } from "@/lib/utils/utils";
import { useRemoveWallet } from "@/lib/api/use-remove-wallet";
import { ConnectBtn } from "./connect-btn";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function SolWalletItem({
  address,
  setAddress,
  isVerify,
  handleRemove,
  serialNumber,
  handleAdd,
}: {
  address: string;
  isVerify: boolean;
  serialNumber: number;
  setAddress: (_a: string) => void;
  handleRemove: () => void;
  handleAdd: () => void;
}) {
  const { publicKey, disconnect } = useWallet();
  const connectAddress = useMemo(
    () => (publicKey ? publicKey.toBase58() : ""),
    [publicKey],
  );

  const { setVisible: solanaModalOpen } = useWalletModal();
  const { getUserInfo } = useFetchUserInfo();
  const { walletVerify } = useWalletVerify();
  const { trigger: removeWalletAction } = useRemoveWallet();

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

  // TODO: remove
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function removeWallet() {
    const res: any = await removeWalletAction({
      chainName: "Solana",
      serialNumber,
    });

    if (res.status) {
      handleRemove();
    }
  }

  return (
    <div className="mb-6 flex flex-col items-start md:flex-row md:items-center">
      <div className="relative ml-0 mr-4 flex h-12 flex-1 items-center justify-between border-b border-[rgba(255,255,255,0.2)]">
        <div
          className={cn(
            "mr-0 flex-1 truncate text-base leading-6 text-[#d6d6d6] md:mr-0",
          )}
        >
          {address}
        </div>
        {isVerify && (
          <Image
            src="/icons/sign.svg"
            width={20}
            height={20}
            alt="sign"
            className="absolute right-0 top-0 cursor-pointer md:top-[14px]"
          />
        )}
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)]">
        <Image
          onClick={handleAdd}
          className="cursor-pointer"
          src="/icons/add-qua.svg"
          width={48}
          height={49}
          alt="add"
        />
      </div>
      <ConnectBtn
        handleConnect={handleConnect}
        handleDisconnect={handleDisconnect}
        isConnect={!!connectAddress && connectAddress === address}
      />
    </div>
  );
}
