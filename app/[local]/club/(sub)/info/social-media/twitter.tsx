import { InputWithClear } from "@/components/input-with-clear";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useSaveSocial } from "@/lib/api/use-save-social";
import { twitterPlaceHolderText } from "@/lib/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LinkBtn } from "../link-btn";
import { useTwitterSign } from "@/lib/api/use-twitter-sign";
import useSWR from "swr";

export function Twitter() {
  const currentPageUrl =
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "";
  const { data: userInfo } = useFetchUserInfo();
  const { trigger: saveSocial } = useSaveSocial();

  const isTwitterLogin = userInfo?.login_data?.twitter_id;

  const [x, setX] = useState(userInfo?.social_media?.Twitter || "");

  const isLink =
    userInfo?.social_media?.Twitter && x === userInfo?.social_media?.Twitter;

  const { code, goTwitter, removeCode } = useTwitterSign();

  useSWR(code ? `save-twitter:${code}` : null, saveTwitter);

  useEffect(() => {
    if (userInfo?.social_media?.Twitter) {
      setX(userInfo?.social_media?.Twitter || "");
    }
  }, [userInfo]);

  function handleLink() {
    goTwitter(currentPageUrl);
  }

  function saveTwitter() {
    if (!code) return;

    saveSocial({
      name: "Twitter",
      data: {
        code,
        redirect_uri: currentPageUrl,
      },
    } as any);
    removeCode();
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex flex-col items-start md:flex-row md:items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="/icons/x.svg" width={30} height={30} alt="" />
          <div className="text-base leading-6 text-[#fff]">X (Twitter)</div>
        </div>
        <InputWithClear
          value={x}
          placeHolderText={twitterPlaceHolderText}
          placeHolder="|  your id"
          onValueChange={() => {}}
          isSign={isLink}
          conClass="md:ml-4 ml-0 flex-1 w-full md:w-auto"
          readOnly={true}
        />
        <LinkBtn
          onClick={handleLink}
          disabled={isTwitterLogin}
          isConnected={isLink}
        />
      </div>
    </div>
  );
}
