import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { NickName } from "./nick-name";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { SignInMethod } from "../sign-dialog/type";
import { LevelTpl } from "./level-tpl";

export default function UserInfoBanner() {
  const { data: userInfo } = useFetchUserInfo();
  const T = useTranslations("Common");

  useEffect(() => {
    if (userInfo?.login_type === "twitter") {
      localStorage.setItem(
        "lastSignInWith",
        JSON.stringify({
          method: SignInMethod.twitter,
          account: userInfo.login_data.nick_name,
        }),
      );
    }
  }, [userInfo?.login_type, userInfo?.login_data]);

  const uidInfoTpl = useMemo(() => {
    return (
      <div className="flex flex-col md:mr-10">
        <div className="mb-1 text-base leading-6 text-[rgba(255,255,255,0.6)]">
          UID
        </div>
        <div className="h-[24px] text-base leading-6 text-white">
          {userInfo?.uid}
        </div>
      </div>
    );
  }, [userInfo?.uid]);

  const memberInfoTpl = useMemo(() => {
    return (
      <div className="flex flex-col md:mr-7">
        <div className="mb-1 text-base leading-6 text-[rgba(255,255,255,0.6)]">
          {T("MembershipNo")}
        </div>
        <div className="h-[24px] text-base leading-6 text-white">
          No.{userInfo?.membership_no}
        </div>
      </div>
    );
  }, [userInfo?.membership_no]);

  const nickNameTpl = useMemo(() => {
    return (
      <div className="flex flex-1 flex-col">
        <div className="mb-1 text-base leading-6 text-[rgba(255,255,255,0.6)]">
          {T("NickName")}
        </div>
        <NickName nickName={userInfo?.nick_name || ""} />
      </div>
    );
  }, [userInfo?.nick_name]);

  return (
    <div className="mb-5 flex flex-col justify-between rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur md:flex-row md:rounded-[18px] md:p-[20px]">
      <div className="hidden items-center md:flex">
        {uidInfoTpl}
        {memberInfoTpl}
        {nickNameTpl}
      </div>

      <div className="flex w-full items-center md:hidden">{nickNameTpl}</div>

      <div className="hidden md:block">
        <LevelTpl />
      </div>

      <div className="mt-5 flex items-center justify-between md:hidden">
        {memberInfoTpl}
        <LevelTpl />
      </div>
    </div>
  );
}
