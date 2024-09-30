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
        <div className="md:fixed left-1/2 md:top-[500px] md:w-[400px] md:-translate-x-1/2 md:-translate-y-1/2 transform md:top-1/2">
          <UserInfoBanner />
          <RouterMenu />
        </div>
      ) : (
        <SignDialog />
      )}
    </>
  );
}
