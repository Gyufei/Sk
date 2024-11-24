"use client";
import RouterMenu from "@/components/router-menu";

import UserInfoBanner from "@/components/user-info-banner";
import SignOut from "@/components/sign-out";

export default function Club() {
  return (
    <div className="content-w-400 md:-ml-[250px]">
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
