import { InputWithClear } from "@/components/input-with-clear";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useSaveSocial } from "@/lib/api/use-save-social";
import { checkEmailRegex } from "@/lib/utils/utils";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { PcInvalidTpl, MobileInValidTpl } from "../invalid-tpl";
import { LinkBtn } from "../link-btn";
import useSWR from "swr";
import { useSendEmail } from "@/lib/api/use-send-email";

export function Email() {
  const currentPageUrl =
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "";
  const { data: userInfo } = useFetchUserInfo();
  const { trigger: saveSocial } = useSaveSocial();

  const [email, setEmail] = useState(userInfo?.social_media?.Email || "");

  const [isValid, setIsValid] = useState(true);

  const isLink =
    userInfo?.social_media?.Email && email === userInfo?.social_media?.Email;

  const {
    email: cbEmail,
    code,
    hasSend,
    sendEmail,
    removeCode,
  } = useSendEmail();

  const disabled = useMemo(
    () => !isValid || !email || (email && !checkEmailRegex(email)),
    [isValid, email],
  );

  useSWR(
    code && cbEmail ? `save-twitter:${code}-${cbEmail}` : null,
    handleSaveEmail,
  );

  useEffect(() => {
    if (cbEmail) {
      setEmail(cbEmail);
    }
  }, [cbEmail]);

  useEffect(() => {
    if (userInfo?.social_media?.Email) {
      setEmail(userInfo?.social_media.Email);
    }
  }, [userInfo]);

  function handleEmailInput(val: string) {
    if (!val) {
      setEmail(val);
      setIsValid(true);
      return;
    }

    const trimVal = val.replace(/(^\s*)|(\s*$)/g, "");
    setEmail(trimVal);
  }

  function handleBlur() {
    if (!email) return;

    setIsValid(checkEmailRegex(email));
  }

  function handleSaveEmail() {
    if (!cbEmail || !code) return;
    saveSocial({
      name: "Email",
      data: {
        email: cbEmail,
        code,
        redirect_uri: currentPageUrl,
      },
    } as any);
    removeCode();
  }

  function handleLink() {
    if (disabled) return;
    sendEmail(email, window.location.origin + window.location.pathname);
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex flex-col items-start md:flex-row md:items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="/icons/email.svg" width={30} height={30} alt="" />
          <div className="text-base leading-6 text-[#d6d6d6]">Email</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={email}
          placeHolder="name@gmail.com"
          onValueChange={(v) => handleEmailInput(v)}
          isSign={isLink}
          conClass="md:ml-4 ml-0 flex-1 w-full md:w-auto"
          onBlur={handleBlur}
        />
        <MobileInValidTpl isValid={isValid} text="Invalid Email." />
        <LinkBtn
          onClick={handleLink}
          disabled={disabled || hasSend}
          isConnected={isLink}
        />
      </div>
      <PcInvalidTpl isValid={isValid} text="Invalid Email." />
    </div>
  );
}
