import { useContext, useEffect, useMemo, useState } from "react";
import { GlobalMsgContext } from "@/components/global-msg-context";
import { useTranslations } from "next-intl";
import { useAccount, useDisconnect } from "wagmi";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useWalletVerify } from "@/lib/api/use-wallet-verify";
import { useRemoveWallet } from "@/lib/api/use-remove-wallet";
import { useAppKit } from "@reown/appkit/react";

enum WalletAction {
  ADD = "ADD",
  REMOVE = "REMOVE",
  CONNECT = "CONNECT",
  UNCONNECT = "UNCONNECT",
}
type WalletActionType = {
  type?: "ADD" | "REMOVE" | "CONNECT" | "UNCONNECT";
  clickAddress?: string;
};

export default function useEthWallet() {
  const T = useTranslations("Common");
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const { data: userInfo, getUserInfo } = useFetchUserInfo();
  const { address: connectAddress } = useAccount();
  const { open: openConnectModal = () => {} } = useAppKit();

  const { walletVerify } = useWalletVerify();
  const { trigger: removeWalletAction } = useRemoveWallet();
  const {
    disconnectAsync: disconnect,
    status: disStatus,
    isPending: isDisconnecting,
  } = useDisconnect();

  const [actionType, setActionType] = useState<WalletActionType>();
  const [isWaitingForNewConnect, setIsWaitingForNewConnect] = useState(false);
  const [isOperating, setIsOperating] = useState(false);
  const chainName = "EVM";
  const isLoginAddress = useMemo(() => {
    const userWalletAddress = userInfo?.login_data?.wallet_address;
    return userWalletAddress && connectAddress === userWalletAddress;
  }, [userInfo, connectAddress]);

  const walletAddress = userInfo?.wallets?.EVM || [];

  function handleAddWallet() {
    if (walletAddress.length >= 5) {
      setGlobalMessage({
        type: "error",
        message: T("MaxWalletMsg"),
      });
      return;
    }
    handleConnect(undefined, WalletAction.ADD);
  }

  async function handleConnect(clickAddress?: string, type?: string) {
    if (isOperating) {
      setGlobalMessage({
        type: "error",
        message: T("WalletOperatingError"),
      });
      return;
    }

    if (isDisconnecting) {
      setGlobalMessage({
        type: "error",
        message: T("WalletDisconnectingError"),
      });
      return;
    }

    if (clickAddress && connectAddress === clickAddress) {
      setGlobalMessage({
        type: "error",
        message: T("WalletConnectedError"),
      });
      return;
    }

    if (clickAddress) {
      setActionType({
        type: WalletAction.CONNECT,
      });
    }

    // if login with wallet
    if (isLoginAddress) {
      openConnectModal({
        view: "Networks",
      });
      return;
    }

    setIsOperating(true);
    await disconnect();

    if (disStatus === "success") {
      setIsOperating(false);
      openConnectModal();
      if (type === WalletAction.ADD) {
        setActionType({
          type: WalletAction.ADD,
        });
        setIsWaitingForNewConnect(true);
      }
    } else {
      setTimeout(() => {
        setIsOperating(false);
        openConnectModal();
        if (type === WalletAction.ADD) {
          setActionType({
            type: WalletAction.ADD,
          });
          setIsWaitingForNewConnect(true);
        }
      }, 600);
    }
  }

  useEffect(() => {
    if (!isWaitingForNewConnect || !connectAddress) return;
    if (
      actionType?.type === WalletAction.ADD &&
      !walletAddress.includes(connectAddress)
    ) {
      verifyWalletAction();
    }
  }, [isWaitingForNewConnect, connectAddress, actionType]);

  async function verifyWalletAction() {
    try {
      const res = await walletVerify({
        chain_name: chainName,
        addr: connectAddress!,
        signature: "",
        salt: "",
      });
      if (res.status) {
        getUserInfo();
      }
    } catch (e) {
      setGlobalMessage({
        type: "error",
        message: T("WalletAddError"),
      });
    } finally {
      setActionType({});
      setIsWaitingForNewConnect(false);
    }
  }

  async function handleRemoveWallet(clickAddress: string, index: number) {
    setActionType({
      type: WalletAction.REMOVE,
    });
    if (clickAddress === userInfo?.login_data?.wallet_address) {
      setGlobalMessage({
        type: "error",
        message: "You cannot delete the wallet that is being logged in.",
      });
      return;
    }
    setIsOperating(true);
    try {
      const res: any = await removeWalletAction({
        chainName: chainName,
        serialNumber: index,
      });
      if (res.status) {
        await getUserInfo();
      }
      setIsOperating(false);
    } catch {
      setIsOperating(false);
    }
  }

  async function handleDisconnect(clickAddress: string) {
    if (isOperating || isDisconnecting) {
      return;
    }

    if (clickAddress === userInfo?.login_data?.wallet_address) {
      setGlobalMessage({
        type: "error",
        message: "You cannot connect to the wallet that is being logged in.",
      });
      return;
    }
    setActionType({
      type: WalletAction.UNCONNECT,
    });
    setIsOperating(true);
    await disconnect();
    setIsOperating(false);
  }

  return {
    connectAddress,
    isLoginAddress,
    walletList: walletAddress,
    handleAddWallet,
    handleRemoveWallet,
    handleDisconnect,
    handleConnect,
  };
}
