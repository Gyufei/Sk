"use client";
import RouterMenu from "@/components/router-menu";

import UserInfoBanner from "@/components/user-info-banner";
import SignOut from "@/app/[local]/brands/dashboard/sign-out";

export default function Club() {
  return (
    <div className="content-w-400">
      <div className="sm:hidden">
        <SignOut isIcon />
      </div>
      <UserInfoBanner />
      <RouterMenu />
      <div className="hidden justify-center sm:flex">
        <SignOut />
      </div>
    </div>
  );
}
