import { InputWithClear } from "@/components/input-with-clear";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useSaveSocial } from "@/lib/api/use-save-social";
import { checkEmailRegex } from "@/lib/utils/utils";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { MobileInValidTpl, PcInvalidTpl } from "@/components/invalid-tpl";
import { LinkBtn } from "../link-btn";
import useSWR from "swr";
import { useSendEmail } from "@/lib/api/use-send-email";
import { EyeToggleBtn, useEyeToggle } from "./eye-toggle-btn";

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

  const { cbEmail, code, hasSend, sendEmail, removeCode } = useSendEmail();

  const { eyeState, handleToggle } = useEyeToggle({ keyword: "emailEyeShow" });

  const disabled = useMemo(
    () => !isValid || !email || (email && !checkEmailRegex(email)),
    [isValid, email],
  );

  useSWR(
    code && cbEmail ? `save-email:${code}-${cbEmail}` : null,
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

  async function handleSaveEmail() {
    if (!cbEmail || !code) return;

    console.log("saveEmail", cbEmail, code, currentPageUrl);
    const res = await saveSocial({
      name: "Email",
      data: {
        email: cbEmail,
        code,
        redirect_uri: currentPageUrl,
      },
    } as any);

    console.log("saveEmail res", res);
    removeCode();
  }

  function handleLink() {
    if (disabled) return;
    sendEmail(email, window.location.origin + window.location.pathname);
  }

  return (
    <div className="mt-[30px] flex flex-col sm:mt-4">
      <div className="relative flex flex-col items-start sm:flex-row sm:items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image
            src="/icons/email.svg"
            width={30}
            height={30}
            alt=""
            className={"h-[24px] w-[24px] sm:h-[30px] sm:w-[30px]"}
          />
          <div className="text-base font-medium leading-[24px] text-[#d6d6d6]">
            Email
          </div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={email}
          type={eyeState ? "password" : "text"}
          placeHolder="name@gmail.com"
          onValueChange={(v) => handleEmailInput(v)}
          isSign={isLink}
          conClass="sm:ml-4 ml-0 flex-1 w-full sm:w-auto"
          inputClass="text-base"
          onBlur={handleBlur}
        />
        <MobileInValidTpl isValid={isValid} text="Invalid Email." />
        <LinkBtn
          onClick={handleLink}
          disabled={disabled || hasSend}
          isConnected={isLink}
        />
        <EyeToggleBtn eyeState={eyeState} handleToggle={handleToggle} />
      </div>
      <PcInvalidTpl isValid={isValid} text="Invalid Email." />
    </div>
  );
}
