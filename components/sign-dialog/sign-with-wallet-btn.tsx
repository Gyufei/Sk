import Image from "next/image";
import { useAccount, useChainId, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useSetAtom } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
import { EthChainInfos } from "@/lib/const";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useSignWithWalletExpire } from "@/lib/use-sign-with-wallet-expire";
import { useTranslations } from "next-intl";

export function SignWithWalletBtn({
  signing,
  setSigning,
}: {
  signing: boolean;
  setSigning: (b: boolean) => void;
}) {
  const T = useTranslations("Common");
  const chainId = useChainId();
  const setUuid = useSetAtom(UuidAtom);

  const { address, isConnected } = useAccount();
  const { open: wcModalOpen } = useWeb3Modal();
  const { disconnect } = useDisconnect();

  const { setSignWithWalletTime } = useSignWithWalletExpire();

  const { disconnect: solanaDisconnect } = useWallet();
  const [isModalOpenForSign, setIsModalOpenForSign] = useState(false);

  const chainNetInfo = Object.values(EthChainInfos).find(
    (c) => c.chainId === chainId,
  );

  useEffect(() => {
    if (address && isConnected && isModalOpenForSign) {
      signForAddress();
      setIsModalOpenForSign(false);
    }
  }, [address, isConnected]);

  async function signForAddress() {
    if (address && isConnected) {
      solanaDisconnect();

      console.log("signMsg");
      await signTo();
    }
  }

  async function signTo() {
    setSigning(true);
    try {
      postSignData();
      setSigning(false);
    } catch (e) {
      console.error("error", e);
      setSigning(false);
      disconnect();
    }
  }

  async function postSignData() {
    const randomCode = btoa(Date.now().toString());
    try {
      const res: any = await fetcher(`${ApiHost}/user/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_type: "Wallet",
          login_data: {
            wallet_address: address,
            chain_name: "EVM",
            signature: btoa(randomCode),
            salt: randomCode,
          },
        }),
      });

      if (res.status === false || !res.uuid) {
        throw new Error(
          "sign in error:" +
            `${chainNetInfo?.name} ${address} ${JSON.stringify(res)}`,
        );
      }

      setUuid(res.uuid);
      setSigning(false);
      setSignWithWalletTime();
    } catch (e) {
      setSigning(false);
      console.log(e);
    }
  }

  function handleSign() {
    if (signing) return;

    if (!address) {
      wcModalOpen();
      setIsModalOpenForSign(true);
    } else {
      signForAddress();
    }
  }

  return (
    <button
      disabled={signing}
      onClick={handleSign}
      className="mt-[20px] flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-solid border-[rgba(255,255,255,0.6)] text-base leading-6 text-[rgba(255,255,255,0.6)] hover:brightness-75"
    >
      <Image
        className="mr-1"
        src="/icons/wallet.svg"
        width={20}
        height={20}
        alt=""
      />
      <div className="font-semibold">{T("SignInWithWallet")}</div>
    </button>
  );
}
