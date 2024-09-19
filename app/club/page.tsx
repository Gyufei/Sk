"use client";
import { useAtomValue } from "jotai/react";

import SignDialog from "@/components/sign-dialog";

import { UuidAtom } from "@/lib/state";

import RouterMenu from "../../components/router-menu";

import "@solana/wallet-adapter-react-ui/styles.css";
import "@mysten/dapp-kit/dist/index.css";
import UserInfoBanner from "@/components/user-info-banner";

export default function Club() {
  const uuid = useAtomValue(UuidAtom);

  return (
    <>
      {uuid ? (
        <div className="fixed left-1/2 top-[500px] w-[400px] -translate-x-1/2 -translate-y-1/2 transform md:top-1/2">
          <UserInfoBanner />
          <RouterMenu />
        </div>
      ) : (
        <SignDialog />
      )}
    </>
  );
}
