import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import CircleText from "./circle-text";
import { cycleWords } from "./constant";
import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
const ReCAPTCHAKey = "6Ldtt2sqAAAAADNjoSXTRuzrWTQHcKYmIvDk_BjV";

export default function SignDialog() {
  const T = useTranslations("Common");
  const [uuid, setUuid] = useAtom(UuidAtom);
  const [isInit, setIsInit] = useState(false);

  const [signDialogOpen, setSignDialogOpen] = useState(false);

  const [signing, setSigning] = useState(false);
  const [showTwitter, setShowTwitter] = useState(false);
  const [lastSignInTwitter, setLastSignInTwitter] = useState("");
  const [showWallet, setShowWallet] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [lastSignInEmail, setLastSignInEmail] = useState("");

  const [walletAttempts, setWalletAttempts] = useState(0);
  const [emailAttempts, setEmailAttempts] = useState(0);
  const [showReCaptcha, setShowReCaptcha] = useState(false);
  const [reCaptchaValue, setReCaptchaValue] = useState<string | null>(null);
  const words = cycleWords;

  useEffect(() => {
    setIsInit(true);
  }, []);

  useEffect(() => {
    if (!isInit || uuid) return;

    if (!uuid) {
      setSignDialogOpen(true);
    }
  }, [isInit, uuid, setUuid, setSignDialogOpen]);

  function checkWithStorage() {
    const lastWith = JSON.parse(
      localStorage.getItem(LastSignInWithKey) || "null",
    );
  
    if (!lastWith) {
      setShowTwitter(true);
      setShowWallet(true);
      setShowEmail(true);
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

  function handleUseOtherAccount() {
    setLastSignInEmail("");
    setShowTwitter(true);
    setShowWallet(true);
    setShowEmail(true);
  }

  function handleSign() {
    checkWithStorage();
  }

  const noMethodShow = !showEmail && !showTwitter && !showWallet;

  function handleSuccess(uId: string) {
    setUuid(uId);
    setSignDialogOpen(false);
  }

  const handleReCaptchaChange = useCallback((value: string | null) => {
    setReCaptchaValue(value);
    setEmailAttempts(0);
    setWalletAttempts(0);
  }, []);

  const incrementAttempts = useCallback((value: { account: string; signInMethod: number }) => {
    if (value.signInMethod === SignInMethod.wallet) {
      setWalletAttempts((prev) => {
        const newValue = prev + 1;
        if (newValue >= 6) {
          setShowReCaptcha(true);
          postSecureRecords(value)
        }
        return newValue;
      });
    }

    if (value.signInMethod === SignInMethod.email) {
      setEmailAttempts((prev) => {
        const newValue = prev + 1;
        if (newValue >= 3) {
          setShowReCaptcha(true);
          postSecureRecords(value)
        }
        return newValue;
      });
    }
    
  }, []);
  
  async function postSecureRecords(value: { account: string; signInMethod: number}) {
    try {
      await fetcher(`${ApiHost}/secure/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: value.account,
          reason: value.signInMethod + '',
        }),
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Dialog open={signDialogOpen}>
      <DialogContent
        showOverlay={false}
        showClose={false}
        className={`flex w-[345px] sm:w-[400px] font-haasDisp ${
          noMethodShow
            ? " mt-[100px] justify-center bg-transparent py-[40px] px-0 sm:mt-0 sm:h-[500px] sm:w-[500px] sm:bg-transparent"
            : "bg-[rgba(255,255,255,0.1)] p-[35px]"
        } flex-col items-center gap-0 rounded-3xl border-none backdrop-blur-[7px] `}
      >
        {noMethodShow && (
          <div className="flex flex-col items-center">
            <div className="text-center text-[#D6D6D6] text-2xl leading-[36px] font-medium sm:text-3xl sm:leading-[60px]">
            {T("SloganText")}
            </div>
            <div className="text-center font-medium text-[48px] leading-[72px] sm:text-[66px] sm:leading-[66px]">
              Juu17 Brands
            </div>
            <div className="font-medium mt-[40px] flex align-middle jutisfy-center leading-[30px] text-[20px] sm:text-[24px] sm:leading-[36px] sm:mt-[100px]">
              <div className="opacity-60">A cryptopia for</div> <CircleText words={words} />
            </div>
            {signing ? (
              <div className="mt-[24px] sm:mt-[47px] flex h-12 items-center justify-center rounded-lg px-[100px] text-base leading-6">
                {T("Signing")}
              </div>
            ) : (
              <div
                onClick={handleSign}
                className="normal-line-button mt-[24px] sm:mt-[47px] flex h-12 cursor-pointer items-center justify-center rounded-lg border px-[100px] text-base leading-6"
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
            <ReCAPTCHA
              sitekey={ReCAPTCHAKey}
              onChange={handleReCaptchaChange}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
