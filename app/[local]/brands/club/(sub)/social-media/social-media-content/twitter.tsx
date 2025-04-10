import { InputWithClear } from "@/components/input-with-clear";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useSaveSocial } from "@/lib/api/use-save-social";
import { twitterPlaceHolderText } from "@/lib/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LinkBtn } from "../link-btn";
import { useTwitterSign } from "@/lib/api/use-twitter-sign";
import useSWR from "swr";
import { EyeToggleBtn, useEyeToggle } from "./eye-toggle-btn";
import { useSignCallbackUrl } from "@/lib/use-sign-callback-url";

export function Twitter() {
  const { getCallbackUrl } = useSignCallbackUrl();
  const { data: userInfo } = useFetchUserInfo();
  const { trigger: saveSocial } = useSaveSocial();

  const isTwitterLogin = userInfo?.login_data?.twitter_id;

  const [x, setX] = useState(userInfo?.social_media?.Twitter || "");

  const isLink =
    userInfo?.social_media?.Twitter && x === userInfo?.social_media?.Twitter;

  const { code, error, goTwitter, removeXVerifyCode } = useTwitterSign();

  useSWR(code ? `save-twitter:${code}` : null, saveTwitter);

  const { eyeState, handleToggle } = useEyeToggle({
    keyword: "twitterEyeShow",
  });

  useEffect(() => {
    if (userInfo?.social_media?.Twitter) {
      setX(userInfo?.social_media?.Twitter || "");
    }
  }, [userInfo]);

  useEffect(() => {
    if (error) {
      removeXVerifyCode();
    }
  }, [error]);

  function handleLink() {
    const callbackUrl = getCallbackUrl();
    sessionStorage.setItem("twitter-verify-callbackUrl", callbackUrl);
    goTwitter(callbackUrl);
  }

  function saveTwitter() {
    if (!code) return;
    const callbackUrl = sessionStorage.getItem("twitter-verify-callbackUrl");

    saveSocial({
      name: "Twitter",
      data: {
        code,
        redirect_uri: callbackUrl,
      },
    } as any);

    removeXVerifyCode();
  }

  return (
    <div className="mt-[30px] flex flex-col sm:mt-4">
      <div className="relative flex flex-col items-start sm:flex-row sm:items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image
            src="/icons/x.svg"
            width={30}
            height={30}
            alt=""
            className={"h-[24px] w-[24px] sm:h-[30px] sm:w-[30px]"}
          />
          <div className="text-base font-medium leading-[24px] text-[#d6d6d6]">
            X (Twitter)
          </div>
        </div>
        <InputWithClear
          value={x}
          type={eyeState ? "password" : "text"}
          placeHolderText={twitterPlaceHolderText}
          placeHolder="twitter"
          onValueChange={() => {}}
          showLink={isLink}
          conClass="sm:ml-4 ml-0 flex-1 w-full sm:w-auto"
          inputClass="text-base"
          readOnly={true}
          showClear={false}
        />
        <LinkBtn
          onClick={handleLink}
          disabled={isTwitterLogin}
          isConnected={isLink}
        />
        <EyeToggleBtn eyeState={eyeState} handleToggle={handleToggle} />
      </div>
    </div>
  );
}
