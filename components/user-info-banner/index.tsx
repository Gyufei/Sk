import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { NickName } from "./nick-name";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { SignInMethod } from "../sign-dialog/type";
import { LevelTpl } from "./level-tpl";

const titleClass = "opacity-60 font-haasDisp font-medium mb-1 text-sm sm:text-base leading-6 text-[rgba(255,255,255,0.6)] text-white";
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
      <div className="flex flex-col mr-[8px] sm:mr-[40px]">
        <div className={`${titleClass}`}>
          UID
        </div>
        <div className="h-[24px] text-base leading-6">
          {userInfo?.uid}
        </div>
      </div>
    );
  }, [userInfo?.uid]);

  const memberInfoTpl = useMemo(() => {
    return (
      <div className="flex flex-col flex-1 sm:mr-7">
        <div className={`${titleClass}`}>
          {T("MembershipNo")}
        </div>
        <div className="h-[24px] text-base leading-6">
          No.{userInfo?.membership_no}
        </div>
      </div>
    );
  }, [userInfo?.membership_no]);

  const nickNameTpl = useMemo(() => {
    return (
      <div className="flex flex-1 flex-col min-w-[100px]">
        <div className={`${titleClass}`}>
          {T("NickName")}
        </div>
        <NickName nickName={userInfo?.nick_name || ""} />
      </div>
    );
  }, [userInfo?.nick_name]);

  return (
    <div className="mb-5 flex flex-col justify-between rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur sm:flex-row sm:rounded-[18px] sm:p-[20px] h-auto sm:h-auto">
      <div className="hidden items-start sm:flex">
        {uidInfoTpl}
        {memberInfoTpl}
        {nickNameTpl}
      </div>

      <div className="flex w-full items-start sm:hidden space-x-3">
        {uidInfoTpl}
        {memberInfoTpl}
        {nickNameTpl}
        <LevelTpl />
      </div>

      <div className="hidden sm:block">
        <LevelTpl />
      </div>

      {/* <div className="mt-5 flex items-center justify-between sm:hidden">
        {memberInfoTpl}
        <LevelTpl />
      </div> */}
    </div>
  );
}
