import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useAtom } from "jotai/react";
import { UuidAtom } from "@/lib/state";
import { LastSignInWithKey, SignInMethod } from "./type";
import SignWithXBtn from "./sign-with-x-btn";
import { SignWithWalletBtn } from "./sign-with-wallet-btn";
import SignWithEmail from "./sign-with-email";

export default function SignDialog() {
  const [uuid, setUuid] = useAtom(UuidAtom);
  const [isInit, setIsInit] = useState(false);

  const [signDialogOpen, setSignDialogOpen] = useState(false);

  const [signing, setSigning] = useState(false);
  const [lastSignInValue, setLastSignInValue] = useState("");
  const [showTwitter, setShowTwitter] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

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
      if (lastWith === SignInMethod.twitter) {
        setShowTwitter(true);
        setLastSignInValue(lastWith.account);
      } else if (lastWith === SignInMethod.wallet) {
        setShowWallet(true);
      } else if (lastWith === SignInMethod.email) {
        setLastSignInValue(lastWith.account);
        setShowEmail(true);
      }
    }
  }

  function handleUseOtherAccount() {
    setLastSignInValue("");
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

  return (
    <Dialog open={signDialogOpen}>
      <DialogContent
        showOverlay={false}
        showClose={false}
        className="flex w-[400px] flex-col items-center gap-0 rounded-3xl border-none bg-[rgba(255,255,255,0.1)] p-[35px] backdrop-blur-[7px]"
      >
        <div className="text-xl leading-[30px]">Welcome to Juu17 Brands</div>
        {noMethodShow && (
          <div
            onClick={handleSign}
            className="normal-line-button mt-[50px] flex h-12 cursor-pointer items-center justify-center rounded-lg border px-[100px] text-base leading-6"
          >
            Sign In
          </div>
        )}
        <SignWithXBtn
          show={showTwitter}
          signing={signing}
          setSigning={setSigning}
          lastAccount={lastSignInValue}
          onSuccess={handleSuccess}
        />
        {showWallet && (
          <SignWithWalletBtn signing={signing} setSigning={setSigning} />
        )}
        {(showTwitter || showWallet) && (
          <div className="mt-[15px] flex w-full items-center justify-between">
            <div
              className="flex-1 border-t border-solid border-white opacity-40"
              // style={{
              //   borderImage:
              //     "linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)",
              // }}
            ></div>
            <div className="mx-[15px] text-base leading-4 text-white opacity-60">
              Or
            </div>
            <div
              className="flex-1 border-t border-solid border-white opacity-40"
              // style={{
              //   borderImage:
              //     "linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)",
              // }}
            ></div>
          </div>
        )}
        <SignWithEmail
          show={showEmail}
          signing={signing}
          lastAccount={lastSignInValue}
          onSuccess={handleSuccess}
        />
        {!(showEmail && showTwitter && showWallet) && !noMethodShow && (
          <div onClick={handleUseOtherAccount}>Change Account</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
