import { useContext, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
import { LastSignInWithKey, SignInMethod } from "./type";
import useSWR from "swr";
import { useSendEmail } from "@/lib/api/use-send-email";
import { GlobalMsgContext } from "../global-msg-context";
import { checkEmailRegex } from "@/lib/utils/utils";

export default function SignWithEmail({
  signing,
  lastAccount,
  show,
  onSuccess,
}: {
  signing: boolean;
  lastAccount: string;
  show: boolean;
  onSuccess: (_i: string) => void;
}) {
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const currentPageUrl = window.location.origin + window.location.pathname;

  const [email, setEmail] = useState("");

  const {
    email: cbEmail,
    code,
    hasSend,
    sendEmail,
    removeCode,
  } = useSendEmail();
  useSWR(code ? `sign-in-with-email:${code}` : null, postSignData);

  useEffect(() => {
    if (cbEmail) {
      setEmail(cbEmail);
    }
  }, [cbEmail]);

  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (lastAccount) {
      setEmail(lastAccount);
    }
  }, [lastAccount]);

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
    if (hasSend) {
      setGlobalMessage({
        type: "warning",
        message: "Too many requests, please try again later",
      });
      return;
    }
    const valid = checkRegex(email);

    if (!valid) {
      setIsValid(false);
      return;
    }

    sendEmail(email, currentPageUrl);
  }

  async function postSignData() {
    if (cbEmail) {
      setEmail(cbEmail);
    }

    try {
      const res: any = await fetcher(`${ApiHost}/user/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_type: "Email",
          login_data: {
            email: cbEmail,
            code,
            redirect_uri: currentPageUrl,
          },
        }),
      });

      if (res.status === false || !res.uuid) {
        throw new Error(
          "email sign in error:" + `${email} ${code}  ${JSON.stringify(res)}`,
        );
      }

      onSuccess(res.uuid);

      localStorage.setItem(
        LastSignInWithKey,
        JSON.stringify({
          method: SignInMethod.email,
          account: email,
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
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setIsValid(checkEmailRegex(e.target.value));
        }}
        data-error={!isValid}
        className="h-12 w-full rounded-lg  border border-[rgba(255,255,255,0.6)] bg-transparent p-4 text-base data-[error=true]:border-[#FF5A5A]"
      />
      <button
        data-disabled={signing}
        onClick={handleConfirm}
        className="mt-[15px] flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-solid border-[rgba(255,255,255,0.6)] text-base leading-6 text-[rgba(255,255,255,0.6)] hover:brightness-75 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=false]:hover:brightness-100"
      >
        <div>Sign In</div>
      </button>
    </div>
  );
}
