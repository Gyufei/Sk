"use client";
import { useEffect } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useAccount } from "wagmi";
import { useSetAtom } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import { usePrevious } from "@/lib/use-pervious";

export default function WalletDisconnected() {
  const { data: userInfo } = useFetchUserInfo();
  const { address: connectAddress, isConnected, isDisconnected } = useAccount();
  const previousAddress = usePrevious(connectAddress);
  const previousIsDisconnected = usePrevious(isDisconnected);

  const setUuid = useSetAtom(UuidAtom);

  function handleSignOut() {
    setUuid("");

    // 刷新当前页面
    location.reload();
  }

  useEffect(() => {
    if (isConnected) return;
    if (previousIsDisconnected === isDisconnected) return;

    if (
      isDisconnected &&
      previousAddress === userInfo?.login_data?.wallet_address
    ) {
      handleSignOut();
    }
  }, [
    isConnected,
    isDisconnected,
    previousIsDisconnected,
    previousAddress,
    userInfo,
  ]);

  return null;
}
