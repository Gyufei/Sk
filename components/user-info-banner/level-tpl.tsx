import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useLevelUp } from "@/lib/use-level-up";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import {
  useConnectModal,
} from '@rainbow-me/rainbowkit';

export function LevelTpl() {
  const T = useTranslations("Common");
  const { data: userInfo, getUserInfo } = useFetchUserInfo();

  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  // const { open: wcModalOpen } = useWeb3Modal();

  const { write: levelUpAction, isPending, isSuccess } = useLevelUp();
  levelUpAction;

  function handleClick() {
    if (!address || isPending) {
      openConnectModal()
    } else {
      levelUpAction();
    }
  }

  useEffect(() => {
    if (isSuccess) {
      getUserInfo();
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col">
      <div className="mb-1 text-sm font-semibold md:text-base text-white leading-6 text-[rgba(255,255,255,0.6)]">
        {T("Level")}
      </div>
      <div
        onClick={() => handleClick()}
        className="flex items-center justify-end text-base leading-6 underline decoration-[rgba(255,255,255,0.1);] decoration-dashed underline-offset-2 hover:decoration-white"
        style={{
          cursor: userInfo?.level === 0 ? "pointer" : "default",
        }}
      >
        {` ${userInfo?.level || 0}`}
      </div>
    </div>
  );
}
