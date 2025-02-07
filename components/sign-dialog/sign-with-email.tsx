import { useContext, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
import { LastSignInWithKey, SignInMethod } from "./type";
import useSWR from "swr";
import { useSendEmail } from "@/lib/api/use-send-email";
import { GlobalMsgContext } from "../global-msg-context";
import { checkEmailRegex } from "@/lib/utils/utils";
import { useTranslations } from "next-intl";

export default function SignWithEmail({
  signing,
  lastAccount,
  show,
  onSuccess,
  incrementAttempts,
  showReCaptcha,
  reCaptchaValue,
}: {
  signing: boolean;
  lastAccount: string;
  show: boolean;
  showReCaptcha: boolean;
  reCaptchaValue: string | null;
  onSuccess: (_i: string) => void;
  incrementAttempts: (value: { account: string; signInMethod: number }) => void;
}) {
  const T = useTranslations("Common");
  const { setGlobalMessage } = useContext(GlobalMsgContext);

  const [inputEmail, setInputEmail] = useState("");
  const [isValid, setIsValid] = useState(true);

  const { cbEmail, code, hasSend, sending, sendEmail, removeCode, seconds } =
    useSendEmail();

  useSWR(code ? `sign-in-with-email:${code}` : null, postSignData);

  useEffect(() => {
    if (lastAccount) {
      setInputEmail(lastAccount);
    }
  }, [lastAccount]);

  function getCurrentPageUrl() {
    const url = new URL(window.location.href);
    return url.origin + url.pathname;
  }

  function checkRegex(x: string) {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;

    return regex.test(x);
  }

  function handleKeyDown(event: any) {
    if (event.keyCode === 13) {
      handleConfirm();
    }
  }

  function handleConfirm() {
    if (showReCaptcha && !reCaptchaValue) {
      // 显示错误消息或阻止登录
      return;
    }
    if (hasSend) {
      setGlobalMessage({
        type: "warning",
        message: "Too many requests, please try again later",
      });
      return;
    }
    const valid = checkRegex(inputEmail);

    if (!valid) {
      setIsValid(false);
      return;
    }
    incrementAttempts({
      account: inputEmail,
      signInMethod: SignInMethod.email,
    });
    sendEmail(inputEmail, getCurrentPageUrl());
  }

  async function postSignData() {
    try {
      const res: any = await fetcher(`${ApiHost}/user/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_type: "Email",
          login_data: {
            code,
          },
        }),
      });

      if (res.status === false || !res.uuid) {
        throw new Error(
          "email sign in error:" + `${cbEmail} ${code}  ${JSON.stringify(res)}`,
        );
      }

      onSuccess(res.uuid);

      localStorage.setItem(
        LastSignInWithKey,
        JSON.stringify({
          method: SignInMethod.email,
          account: cbEmail,
        }),
      );

      removeCode();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div
      style={{
        display: show ? "block" : "none",
      }}
      className="mt-[15px] w-full"
    >
      <Input
        onKeyDown={handleKeyDown}
        value={inputEmail}
        onChange={(e) => {
          setInputEmail(e.target.value);
          setIsValid(checkEmailRegex(e.target.value));
        }}
        data-error={!isValid}
        placeholder="Email"
        className="h-12 w-full rounded-lg  border border-[rgba(255,255,255,0.6)] bg-transparent p-4 text-base data-[error=true]:border-[#FF5A5A]"
      />
      <button
        data-disabled={signing || sending || hasSend}
        onClick={handleConfirm}
        className="mt-[15px] flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-solid border-[rgba(255,255,255,0.6)] text-base leading-6 text-[rgba(255,255,255,0.6)] hover:brightness-75 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=false]:hover:brightness-100"
      >
        <div>{hasSend && !sending ? <>{seconds}s</> : T("SignIn")}</div>
      </button>
    </div>
  );
}
