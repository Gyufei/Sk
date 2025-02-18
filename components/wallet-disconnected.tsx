"use client";
import { useEffect } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useAtom } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import { usePrevious } from "@/lib/use-pervious";
import { useAppKitAccount } from "@reown/appkit/react";

export default function WalletDisconnected() {
  const { data: userInfo } = useFetchUserInfo();
  const { address: connectAddress, isConnected, status } = useAppKitAccount();
  const isDisconnected = status === "disconnected";
  const previousAddress = usePrevious(connectAddress);
  const previousIsDisconnected = usePrevious(isDisconnected);

  const [uuid, setUuid] = useAtom(UuidAtom);

  useEffect(() => {
    if (
      !uuid ||
      !userInfo ||
      !userInfo?.login_data ||
      !userInfo?.login_data?.wallet_address
    )
      return;

    if (isConnected) return;

    if (previousIsDisconnected === isDisconnected) return;

    // observe the login wallet disconnected
    if (
      isDisconnected &&
      previousAddress === userInfo?.login_data?.wallet_address
    ) {
      setUuid("");
      location.reload();
    }
  }, [
    uuid,
    userInfo,
    isConnected,
    isDisconnected,
    previousIsDisconnected,
    previousAddress,
    setUuid,
  ]);

  return null;
}
