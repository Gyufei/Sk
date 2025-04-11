"use client";
import { useEffect, useState } from "react";
import { useAtom } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import { LastSignInWithKey, SignInMethod } from "./type";
import SignWithXBtn from "./sign-with-x-btn";
import { SignWithWalletBtn } from "./sign-with-wallet-btn";
import SignWithEmail from "./sign-with-email";
import { useTranslations } from "next-intl";
import ReCAPTCHA from "react-google-recaptcha";
import { useCallback } from "react";
import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/app/navigation";
import BrandsDisplay from "../brands-display";

const ReCAPTCHAKey = "6Ldtt2sqAAAAADNjoSXTRuzrWTQHcKYmIvDk_BjV";

export default function SignDialog() {
  const T = useTranslations("Common");
  const [uuid, setUuid] = useAtom(UuidAtom);
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from");

  const [signing, setSigning] = useState(false);
  const [showTwitter, setShowTwitter] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const [lastSignInTwitter, setLastSignInTwitter] = useState("");
  const [lastSignInEmail, setLastSignInEmail] = useState("");

  const [, setWalletAttempts] = useState(0);
  const [, setEmailAttempts] = useState(0);
  const [showReCaptcha, setShowReCaptcha] = useState(false);
  const [reCaptchaValue, setReCaptchaValue] = useState<string | null>(null);

  const noMethodShow = !showEmail && !showTwitter && !showWallet;

  function handleUseOtherAccount() {
    setLastSignInEmail("");
    setShowTwitter(true);
    setShowWallet(true);
    setShowEmail(true);
  }

  function handleShowSignInMethod() {
    const lastWith = JSON.parse(
      localStorage.getItem(LastSignInWithKey) || "null",
    );

    if (!lastWith) {
      setShowWallet(true);
      setShowTwitter(false);
      setShowEmail(false);
      return;
    }

    if (lastWith) {
      if (lastWith.method === SignInMethod.twitter) {
        setLastSignInTwitter(lastWith.account);
        setShowTwitter(true);
      } else if (lastWith.method === SignInMethod.wallet) {
        setShowWallet(true);
      } else if (lastWith.method === SignInMethod.email) {
        setLastSignInEmail(lastWith.account);
        setShowEmail(true);
      }
    }
  }

  useEffect(() => {
    if (uuid) {
      router.push(from ? `/${from}` : "/");
    }
  }, [uuid]);

  function handleSuccess(uId: string) {
    setUuid(uId);
  }

  const handleReCaptchaChange = useCallback((value: string | null) => {
    setReCaptchaValue(value);
    setEmailAttempts(0);
    setWalletAttempts(0);
  }, []);

  const incrementAttempts = useCallback(
    (value: { account: string; signInMethod: number }) => {
      if (value.signInMethod === SignInMethod.wallet) {
        setWalletAttempts((prev) => {
          const newValue = prev + 1;
          if (newValue >= 6) {
            setShowReCaptcha(true);
            postSecureRecords(value);
          }
          return newValue;
        });
      }

      if (value.signInMethod === SignInMethod.email) {
        setEmailAttempts((prev) => {
          const newValue = prev + 1;
          if (newValue >= 3) {
            setShowReCaptcha(true);
            postSecureRecords(value);
          }
          return newValue;
        });
      }
    },
    [],
  );

  async function postSecureRecords(value: {
    account: string;
    signInMethod: number;
  }) {
    try {
      await fetcher(`${ApiHost}/secure/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: value.account,
          reason: value.signInMethod + "",
        }),
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div
      className={`flex w-[345px] font-haasDisp sm:ml-[-240px] sm:w-[400px] ${
        noMethodShow
          ? "justify-center bg-transparent px-0 pb-5 sm:h-[500px] sm:w-[500px] sm:bg-transparent"
          : "bg-[rgba(255,255,255,0.1)] p-[35px]"
      } flex-col items-center gap-0 rounded-3xl border-none`}
    >
      {noMethodShow && (
        <div className="flex flex-col items-center">
          <BrandsDisplay />
          {signing ? (
            <div className="mt-[24px] flex h-12 items-center justify-center rounded-lg px-[100px] text-base leading-6 sm:mt-[47px]">
              {T("Signing")}
            </div>
          ) : (
            <div
              onClick={handleShowSignInMethod}
              className="normal-line-button mt-[24px] flex h-12 cursor-pointer items-center justify-center rounded-lg border px-[100px] text-base leading-6 sm:mt-[47px]"
            >
              {T("SignIn")}
            </div>
          )}
        </div>
      )}
      {!noMethodShow && (
        <div className="text-xl leading-[30px]">{T("WelcomeTo")}</div>
      )}
      <SignWithXBtn
        show={showTwitter}
        signing={signing}
        setSigning={setSigning}
        lastAccount={lastSignInTwitter}
        onSuccess={handleSuccess}
      />
      {showWallet && (
        <SignWithWalletBtn
          signing={signing}
          setSigning={setSigning}
          incrementAttempts={incrementAttempts}
          showReCaptcha={showReCaptcha}
          reCaptchaValue={reCaptchaValue}
          onSuccess={handleSuccess}
        />
      )}
      {(showTwitter || showWallet) && showEmail && (
        <div className="mt-[15px] flex w-full items-center justify-between">
          <div
            className="h-[1px] flex-1 opacity-40"
            style={{
              background:
                "linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)",
            }}
          ></div>
          <div className="mx-[15px] text-base leading-4 text-white opacity-60">
            {T("Or")}
          </div>
          <div
            className="h-[1px] flex-1 opacity-40"
            style={{
              background:
                "linear-gradient(270deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
            }}
          ></div>
        </div>
      )}
      <SignWithEmail
        show={showEmail}
        signing={signing}
        lastAccount={lastSignInEmail}
        onSuccess={handleSuccess}
        showReCaptcha={showReCaptcha}
        reCaptchaValue={reCaptchaValue}
        incrementAttempts={incrementAttempts}
      />
      {!(showEmail && showTwitter && showWallet) && !noMethodShow && (
        <div
          onClick={handleUseOtherAccount}
          className="mt-[10px] cursor-pointer border-b border-dashed border-[rgba(255,255,255,0.3)] text-center text-[14px] leading-5 text-[rgba(255,255,255,0.3);]"
        >
          {T("ChangeAccount")}
        </div>
      )}
      {showReCaptcha && (
        <div className="mt-[15px]">
          <ReCAPTCHA sitekey={ReCAPTCHAKey} onChange={handleReCaptchaChange} />
        </div>
      )}
    </div>
  );
}
