import { useLang } from "@/lib/use-lang";
import { useMemo } from "react";
import { NickName } from "./nick-name";
import { useFetchUserInfo } from "@/lib/use-fetch-user-info";

export default function UserInfoBanner() {
  const { data: userInfo } = useFetchUserInfo();
  const { isEn } = useLang();

  const uidInfoTpl = useMemo(() => {
    return (
      <div className="flex flex-col md:mr-10">
        <div className="mb-1 text-base leading-6 text-[rgba(255,255,255,0.6)]">
          UID
        </div>
        <div className="h-[24px] text-base leading-6 text-white">
          #{userInfo?.uid}
        </div>
      </div>
    );
  }, [userInfo?.uid]);

  const memberInfoTpl = useMemo(() => {
    return (
      <div className="flex flex-col md:mr-7">
        <div className="mb-1 text-base leading-6 text-[rgba(255,255,255,0.6)]">
          {isEn ? "Membership No." : "会员编号"}
        </div>
        <div className="h-[24px] text-base leading-6 text-white">
          #{userInfo?.membership_no}
        </div>
      </div>
    );
  }, [userInfo?.membership_no, isEn]);

  const nickNameTpl = useMemo(() => {
    return (
      <div className="flex flex-col md:mr-14 ">
        <div className="mb-1 text-base leading-6 text-[rgba(255,255,255,0.6)]">
          {isEn ? "Nick Name" : "昵称"}
        </div>
        <NickName nickName={userInfo?.nick_name || ""} />
      </div>
    );
  }, [isEn, userInfo?.nick_name]);

  const windFallTpl = useMemo(() => {
    return (
      <div className="flex flex-col">
        <div className="mb-1 text-base leading-6 text-[rgba(255,255,255,0.6)]">
          Level
        </div>
        <div className="flex items-center justify-end text-base leading-6 text-white underline decoration-[rgba(255,255,255,0.1);] decoration-dashed underline-offset-2">
          {` ${userInfo?.level}`}
        </div>
      </div>
    );
  }, [isEn, userInfo?.level]);

  return (
    <div className="mb-5 flex flex-col justify-between rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur md:flex-row md:rounded-[18px] md:p-[20px]">
      <div className="hidden items-center md:flex">
        {uidInfoTpl}
        {memberInfoTpl}
        {nickNameTpl}
      </div>

      <div className="flex w-full items-center md:hidden">{nickNameTpl}</div>

      <div className="hidden md:block">{windFallTpl}</div>

      <div className="mt-5 flex items-center justify-between md:hidden">
        {memberInfoTpl}
        {windFallTpl}
      </div>
    </div>
  );
}
