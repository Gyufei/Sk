"use client";
import { useAtomValue } from "jotai/react";

import SignDialog from "@/components/sign-dialog";

import { UuidAtom } from "@/lib/api/state";

import RouterMenu from "@/components/router-menu";

import UserInfoBanner from "@/components/user-info-banner";

export default function Club() {
  const uuid = useAtomValue(UuidAtom);

  return (
    <>
      {uuid ? (
        <div className="content-w-400 md:-ml-[250px]">
          <UserInfoBanner />
          <RouterMenu />
        </div>
      ) : (
        <SignDialog />
      )}
    </>
  );
}
