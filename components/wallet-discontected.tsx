
"use client";
import { usePrevious } from 'ahooks';
import { useEffect } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useAccount } from "wagmi";
import { useAtom } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";


export function WalletDiscontected() {
  const { data: userInfo } = useFetchUserInfo();
  const { address: connectAddress, isConnected, isDisconnected} = useAccount();
  const previousAddress = usePrevious(connectAddress);


  const [, setUuid] = useAtom(UuidAtom);

  function handleSignOut() {
    setUuid("");

    // 刷新当前页面
    location.reload()
  }

  useEffect(() => {
    if (isDisconnected === false) return
    async function checkDisconnet() {
      const userWalletAddress = userInfo?.login_data?.wallet_address;
      if (previousAddress && previousAddress !== userWalletAddress) {
        localStorage.setItem("CurrentAddressItem", "")
        console.log("退出登录")
        // handleSignOut()
      }
    }

    checkDisconnet();
  }, [isDisconnected])
  
  return null;
}
