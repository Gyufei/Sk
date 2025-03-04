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
  const { data: userInfo } = useFetchUserInfo();
  const { trigger: saveSocial } = useSaveSocial();

  const [inputEmail, setInputEmail] = useState(
    userInfo?.social_media?.Email || "",
  );

  const [isValid, setIsValid] = useState(true);

  const isGoogleEmail = useMemo(() => {
    if (!isValid) return false;

    return inputEmail.endsWith("@gmail.com");
  }, [isValid, inputEmail]);

  const isLink =
    userInfo?.social_media?.Email &&
    inputEmail === userInfo?.social_media?.Email;

  const { code, hasSend, sendEmail, removeEmailVerifyHash } = useSendEmail();

  const { eyeState, handleToggle } = useEyeToggle({ keyword: "emailEyeShow" });

  const disabled = useMemo(
    () =>
      !isValid || !inputEmail || (inputEmail && !checkEmailRegex(inputEmail)),
    [isValid, inputEmail],
  );

  useSWR(code ? `save-email:${code}` : null, handleSaveEmail);

  useEffect(() => {
    if (userInfo?.social_media?.Email) {
      setInputEmail(userInfo?.social_media.Email);
    }
  }, [userInfo]);

  function handleEmailInput(val: string) {
    if (!val) {
      setInputEmail(val);
      setIsValid(true);
      return;
    }

    const trimVal = val.replace(/(^\s*)|(\s*$)/g, "");
    setInputEmail(trimVal);
  }

  function handleBlur() {
    if (!inputEmail) return;

    setIsValid(checkEmailRegex(inputEmail));
  }

  async function handleSaveEmail() {
    if (!code) return;

    const res = await saveSocial({
      name: "Email",
      data: {
        code,
      },
    } as any);

    console.info("saveEmail res", res);
    removeEmailVerifyHash();
  }

  function handleLink() {
    if (disabled) return;

    if (isGoogleEmail) {
      console.info("isGoogleEmail", isGoogleEmail);
    } else {
      sendEmail(inputEmail, window.location.origin + window.location.pathname);
    }
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
          value={inputEmail}
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
