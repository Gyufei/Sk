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
  const [showReCaptcha, setShowReCaptcha] = useState(false);
  const [reCaptchaValue, setReCaptchaValue] = useState<string | null>(null);
  const words = ["Hello", "World", "Ciaoo", "World"];
  


  useEffect(() => {
    setIsInit(true);
  }, []);

  useEffect(() => {
    if (!isInit || uuid) return;

    if (!uuid) {
      setUuid("");
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
  }, []);

  const incrementWalletAttempts = useCallback(() => {
    setWalletAttempts((prev) => {
      const newValue = prev + 1;
      if (newValue >= 6) {
        setShowReCaptcha(true);
      }
      return newValue;
    });
  }, []);

  return (
    <Dialog open={signDialogOpen}>
      <DialogContent
        showOverlay={false}
        showClose={false}
        className={(`flex md:w-[400px] w-[345px] ${noMethodShow ? 'md:w-[500px] md:h-[500px] justify-center bg-transparent' : 'bg-[rgba(255,255,255,0.1)]'} flex-col items-center gap-0 rounded-3xl border-none  p-[35px] backdrop-blur-[7px] `)}
      >
        {noMethodShow && (
          <div className="flex flex-col items-center">
            <div className="text-3xl font-normal text-center">Build cypto new orders</div>
             <div className="text-6xl mt-8 text-center">Juu17 Brands</div>
             <div className="text-lg mt-16">A cryptopia for <CircleText words={words}/></div> 
            {
              (signing ? (
                <div className="mt-[50px] flex h-12 items-center justify-center rounded-lg px-[100px] text-base leading-6">
                  {T("Signing")}
                </div>
              ) : (
                <div
                  onClick={handleSign}
                  className="normal-line-button mt-[50px] flex h-12 cursor-pointer items-center justify-center rounded-lg border px-[100px] text-base leading-6"
                >
                  {T("SignIn")}
                </div>
              ))
            }
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
            incrementWalletAttempts={incrementWalletAttempts}
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
          <ReCAPTCHA
            sitekey="6LfjY2cqAAAAAOu-5K148mkeFQz42tmA_MlfloVp"
            onChange={handleReCaptchaChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
