import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useWalletVerify } from "@/lib/api/use-wallet-verify";
import { genSignMsg } from "@/lib/utils/sign-utils";
import { cn } from "@/lib/utils/utils";
import { useRemoveWallet } from "@/lib/api/use-remove-wallet";
import { ConnectBtn } from "./connect-btn";
import base58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function SolWalletItem({
  address,
  setAddress,
  isSign,
  setIsSign,
  handleRemove,
  serialNumber,
  handleAdd,
}: {
  address: string;
  isSign: boolean;
  serialNumber: number;
  setAddress: (_a: string) => void;
  setIsSign: (_i: boolean) => void;
  handleRemove: () => void;
  handleAdd: () => void;
}) {
  const { publicKey, signMessage: solanaSign, disconnect } = useWallet();
  const connectAddress = useMemo(
    () => (publicKey ? publicKey.toBase58() : ""),
    [publicKey],
  );

  const { setVisible: solanaModalOpen } = useWalletModal();
  const { getUserInfo } = useFetchUserInfo();
  const { walletVerify } = useWalletVerify();
  const { removeWalletAction } = useRemoveWallet();

  const [isWaitingForNewConnect, setIsWaitingForNewConnect] = useState(false);
  const [isOperating, setIsOperating] = useState(false);

  useEffect(() => {
    if (!isWaitingForNewConnect || !connectAddress) return;

    if (connectAddress && !address) {
      signSolanaMsg();
    }
  }, [isWaitingForNewConnect, connectAddress, address]);

  async function handleOperation() {
    if (isOperating) return;
    setIsOperating(true);
    if (!isSign || !connectAddress) {
      await linkWallet();
    } else {
      await unlinkWallet();
    }
    getUserInfo();
    setIsOperating(false);
  }

  async function linkWallet() {
    if (address && connectAddress === address) {
      signSolanaMsg();
    } else {
      await disconnect();
      setIsWaitingForNewConnect(true);
      solanaModalOpen(true);
    }
  }

  async function unlinkWallet() {
    disconnect();
  }

  async function signSolanaMsg() {
    if (!connectAddress) {
      solanaModalOpen(true);
    } else {
      setAddress(connectAddress);
      const { salt, msg } = genSignMsg();
      const message = new TextEncoder().encode(msg);
      const signature = await solanaSign!(message);
      const data = base58.encode(signature);
      const res = await walletVerify({
        chain_name: "Solana",
        addr: connectAddress!,
        signature: data,
        salt,
      });

      if (res?.status) {
        setIsSign(true);
      }
    }
  }

  // TODO: remove
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function removeWallet() {
    const res: any = await removeWalletAction("Solana", serialNumber);

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
        {isSign && (
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
        onClick={handleOperation}
        disabled={isOperating}
        isConnect={connectAddress === address}
        isSign={isSign}
      />
    </div>
  );
}
