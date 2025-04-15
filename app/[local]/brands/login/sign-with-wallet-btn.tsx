/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  useAppKit,
  useDisconnect,
  useAppKitAccount,
  useAppKitNetwork,
} from "@reown/appkit/react";
import { LastSignInWithKey, SignInMethod } from "./type";
import {} from "@reown/appkit/react";

export function SignWithWalletBtn({
  signing,
  setSigning,
  incrementAttempts,
  shouldReCaptcha,
  getRecaptchaValue,
  onSuccess,
}: {
  signing: boolean;
  setSigning: (b: boolean) => void;
  incrementAttempts: (value: { account: string; signInMethod: number }) => void;
  shouldReCaptcha: boolean;
  getRecaptchaValue: () => Promise<string | null>;
  onSuccess: (uId: string) => void;
}) {
  const T = useTranslations("Common");

  const { open: openConnectModal = () => {} } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();
  const { disconnect } = useDisconnect();

  const isSolana = caipNetwork?.name === "Solana";

  const { disconnect: solanaDisconnect } = useWallet();
  const [isModalOpenForSign, setIsModalOpenForSign] = useState(false);

  useEffect(() => {
    if (address && isConnected && isModalOpenForSign) {
      signForAddress();
      setIsModalOpenForSign(false);
    }
  }, [address, isConnected, isModalOpenForSign, signForAddress]);

  async function signForAddress() {
    if (address && isConnected) {
      if (!isSolana) {
        solanaDisconnect();
      }

      if (shouldReCaptcha) {
        const reCaptchaValue = await getRecaptchaValue();
        if (!reCaptchaValue) {
          return;
        }
      }

      incrementAttempts({
        account: address,
        signInMethod: SignInMethod.wallet,
      });

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
            chain_name: isSolana ? "Solana" : "EVM",
            signature: btoa(randomCode),
            salt: randomCode,
          },
        }),
      });

      if (res.status === false || !res.uuid) {
        throw new Error(
          "sign in error:" +
            `${caipNetwork?.name} ${address} ${JSON.stringify(res)}`,
        );
      }

      onSuccess(res.uuid);

      localStorage.setItem(
        LastSignInWithKey,
        JSON.stringify({
          method: SignInMethod.wallet,
          account: address,
        }),
      );
      setSigning(false);
    } catch (e) {
      setSigning(false);
      console.log(e);
    }
  }

  function handleSign() {
    if (signing) return;

    if (!address) {
      openConnectModal();
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
