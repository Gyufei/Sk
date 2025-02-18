import { useContext, useEffect, useMemo, useState } from "react";
import { GlobalMsgContext } from "@/components/global-msg-context";
import { useTranslations } from "next-intl";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useWalletVerify } from "@/lib/api/use-wallet-verify";
import { useRemoveWallet } from "@/lib/api/use-remove-wallet";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

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

export default function useSolWallet() {
  const { data: userInfo, getUserInfo } = useFetchUserInfo();
  const [actionType, setActionType] = useState<WalletActionType>();
  const [isWaitingForNewConnect, setIsWaitingForNewConnect] = useState(false);
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const [isOperating, setIsOperating] = useState(false);
  const T = useTranslations("Common");
  const { walletVerify } = useWalletVerify();
  const { trigger: removeWalletAction } = useRemoveWallet();
  const chainName = "Solana";
  const { publicKey, disconnect } = useWallet();
  const connectAddress = useMemo(
    () => (publicKey ? publicKey.toBase58() : ""),
    [publicKey],
  );

  const { setVisible: solanaModalOpen } = useWalletModal();

  const isLoginAddress = useMemo(() => {
    const userWalletAddress = userInfo?.login_data?.wallet_address;
    return userWalletAddress && connectAddress === userWalletAddress;
  }, [userInfo, connectAddress]);

  const walletAddress = userInfo?.wallets?.Solana || [];

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

    if (clickAddress) {
      setActionType({
        type: WalletAction.CONNECT,
      });
    }

    setIsOperating(true);
    await disconnect();
    solanaModalOpen(true);
    setIsOperating(false);
    if (type === WalletAction.ADD) {
      setActionType({
        type: WalletAction.ADD,
      });
      setIsWaitingForNewConnect(true);
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

  async function handleDisconnect() {
    if (isOperating) return;
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
