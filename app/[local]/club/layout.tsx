"use client";

import { useRouter } from "@/app/navigation";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useSignWithWalletExpire } from "@/lib/use-sign-with-wallet-expire";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { isConnected } = useAccount();
  const { data: userInfo } = useFetchUserInfo();

  const { getSignWithWalletTime, setSignWithWalletTime } =
    useSignWithWalletExpire();

  useEffect(() => {
    const time = getSignWithWalletTime();
    const now = new Date().getTime();
    const duration = Math.floor((now - Number(time)) / 1000);

    if (duration > 60 * 60) {
      checkIsWalletStill();
    }
  }, []);

  function checkIsWalletStill() {
    if (!userInfo) return;
    if (userInfo?.login_data?.wallet_address && !isConnected) {
      router.replace("/club");
    } else {
      setSignWithWalletTime();
    }
  }

  return <>{children}</>;
}
