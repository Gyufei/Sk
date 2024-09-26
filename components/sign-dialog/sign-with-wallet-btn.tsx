import Image from "next/image";
import {
  useAccount,
  useChainId,
  useDisconnect,
  useSignMessage,
  useSwitchNetwork,
} from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useSetAtom } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
import { genSignMsg } from "@/lib/utils/sign-utils";
import { EthChainInfos } from "@/lib/const";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export function SignWithWalletBtn({
  signing,
  setSigning,
}: {
  signing: boolean;
  setSigning: (b: boolean) => void;
}) {
  const chainId = useChainId();
  const setUuid = useSetAtom(UuidAtom);

  const { address, isConnected } = useAccount();
  const { open: wcModalOpen } = useWeb3Modal();
  const { signMessageAsync: signMessage } = useSignMessage();
  const { switchNetworkAsync: switchChain } = useSwitchNetwork();
  const { disconnect } = useDisconnect();

  const { disconnect: solanaDisconnect } = useWallet();
  const [isModalOpenForSign, setIsModalOpenForSign] = useState(false);

  const OpNetInfo = Object.values(EthChainInfos).find((c) => c.chainId === 10);

  useEffect(() => {
    if (address && isConnected && isModalOpenForSign) {
      switchChainAndSign();
      setIsModalOpenForSign(false);
    }
  }, [address, isConnected]);

  async function switchChainAndSign() {
    if (address && isConnected) {
      solanaDisconnect();
      if (!OpNetInfo) {
        return;
      }

      if (chainId !== OpNetInfo?.chainId) {
        await switchChain!(OpNetInfo.chainId!);
        signMsg();
      } else {
        console.log("signMsg");
        await signMsg();
      }
    }
  }

  async function signMsg() {
    setSigning(true);
    const { salt, msg } = genSignMsg();

    try {
      const signature = await signMessage({
        message: msg,
      });

      postSignData(signature, salt);
    } catch (e) {
      console.error("error", e);
      setSigning(false);
      disconnect();
    }
  }

  async function postSignData(signature: string, salt: string) {
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
            chain_name: OpNetInfo?.name + " Mainnet",
            signature,
            salt,
          },
        }),
      });

      if (res.status === false || !res.uuid) {
        throw new Error(
          "sign in error:" +
            `${
              OpNetInfo?.name
            } ${address} ${signature} ${salt} ${JSON.stringify(res)}`,
        );
      }

      setUuid(res.uuid);
      setSigning(false);
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
      switchChainAndSign();
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
      <div className="font-semibold">Sign in with Wallet</div>
    </button>
  );
}
