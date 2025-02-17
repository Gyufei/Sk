import { useContext, useEffect, useState } from "react";
import fetcher from "./fetcher";
import { ApiHost } from "./path";
import { useAtomValue } from "jotai";
import { UuidAtom } from "./state";
import { GlobalMsgContext } from "@/components/global-msg-context";
import { getHashParam } from "../utils/utils";
import { useLocale } from "next-intl";

const SendEmailKey = "sendEmail";

export function useSendEmail() {
  const locale = useLocale();
  const { setGlobalMessage } = useContext(GlobalMsgContext);

  const [code, setCode] = useState("");
  const [hasSend, setHasSend] = useState(false);
  const [sending, setSending] = useState(false);
  const [lastSendTime, setLastSendTime] = useState("");
  const [seconds, setSeconds] = useState(60);
  const uuid = useAtomValue(UuidAtom);

  useEffect(() => {
    const verifyToken = getHashParam("verify_token");

    if (verifyToken) {
      setCode(verifyToken);
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem("sendEmailCb");

    const lt = localStorage.getItem(SendEmailKey);
    if (lt) {
      setLastSendTime(lt);
    }
  }, []);

  useEffect(() => {
    if (!lastSendTime) {
      setSeconds(60);
      return;
    }

    const now = new Date().getTime();
    const duration = 60 * 1000;

    const time = Number(lastSendTime);
    if (time > now - duration) {
      let startTime = Math.ceil((time - (now - duration)) / 1000);
      setSeconds(startTime);
      setHasSend(true);
      const timer = setInterval(() => {
        if (startTime === 0) {
          clearInterval(timer);
          setHasSend(false);
        }
        setSeconds(startTime--);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lastSendTime]);

  async function sendEmail(email: string, cb: string) {
    if (hasSend) return;

    setSending(true);
    setHasSend(true);
    setSeconds(60);

    try {
      const res: any = await fetcher(`${ApiHost}/user/send_email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          redirect_uri: cb,
          user_id: uuid || "00000000-0000-0000-0000-000000000000",
          lang: locale,
        }),
      });

      if (res) {
        setHasSend(true);
        const now = new Date().getTime().toString();
        setLastSendTime(now);
        localStorage.setItem(SendEmailKey, now);

        setGlobalMessage({
          type: "success",
          message: "Email sent successfully",
        });
      }
      setSending(false);
    } catch (error) {
      setHasSend(false);
      setSending(false);
    }
  }

  function removeEmailVerifyHash() {
    window.location.hash = "";
  }

  return {
    code,
    sending,
    hasSend,
    sendEmail,
    removeEmailVerifyHash,
    seconds,
  };
}
