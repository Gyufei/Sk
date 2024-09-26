import Image from "next/image";
import { useEffect, useState } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { useWalletVerify } from "@/lib/api/use-wallet-verify";
import { genSignMsg } from "@/lib/utils/sign-utils";
import { cn } from "@/lib/utils/utils";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRemoveWallet } from "@/lib/api/use-remove-wallet";
import { ConnectBtn } from "./connect-btn";

export function EthWalletItem({
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
  const { address: connectAddress } = useAccount();
  const { open: wcModalOpen } = useWeb3Modal();
  const { disconnectAsync: disconnect, isLoading: isDisconnecting } =
    useDisconnect();

  const { signMessageAsync: signMessage } = useSignMessage();
  const { address: walletAddress } = useAccount();

  const { getUserInfo } = useFetchUserInfo();
  const { walletVerify } = useWalletVerify();
  const { removeWalletAction } = useRemoveWallet();

  const [isWaitingForNewConnect, setIsWaitingForNewConnect] = useState(false);
  const [isOperating, setIsOperating] = useState(false);

  useEffect(() => {
    if (!isWaitingForNewConnect || !connectAddress) return;

    if (connectAddress && !address) {
      signEvmMsg();
    }
  }, [isWaitingForNewConnect, connectAddress, address]);

  async function handleOperation() {
    if (isOperating) return;
    setIsOperating(true);

    if (isSign && (!connectAddress || connectAddress !== address)) {
      await linkWallet();
    } else {
      await unlinkWallet();
    }
    getUserInfo();
    setIsOperating(false);
  }

  async function linkWallet() {
    if (address && connectAddress === address) {
      signEvmMsg();
    } else {
      await disconnect();
      setIsWaitingForNewConnect(true);
      await wcModalOpen();
    }
  }

  async function unlinkWallet() {
    if (isDisconnecting) return;
    await disconnect();
  }

  async function signEvmMsg() {
    const { salt, msg } = genSignMsg();

    try {
      const data = await signMessage({
        message: msg,
      });

      const res = await walletVerify({
        chain_name: "EVM",
        addr: walletAddress!,
        signature: data,
        salt,
      });

      if (res?.status) {
        setAddress(walletAddress!);
        setIsSign(true);
        setAddress(connectAddress!);
        setIsWaitingForNewConnect(false);
      }
    } catch (e) {
      console.error("error", e);
    }
  }

  // TODO: remove
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function removeWallet() {
    const res: any = await removeWalletAction("EVM", serialNumber);

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
