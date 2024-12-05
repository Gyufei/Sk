"use client";

import { useContext, useEffect } from "react";
import Image from "next/image";
import { GlobalMsgContext } from "./global-msg-context";

export default function GlobalActionTip() {
  const { globalMessage, setGlobalMessage } = useContext(GlobalMsgContext);
  const { type, message } = globalMessage || {};

  useEffect(() => {
    if (globalMessage) {
      const d = setTimeout(() => {
        setGlobalMessage(null);
      }, 5000);
      return () => clearTimeout(d);
    }
  }, [globalMessage, setGlobalMessage]);

  return (
    <>
      {message && type ? (
        <div className="opacity-1 fixed bottom-10 left-1/2 z-50 flex h-[56px] w-fit -translate-x-1/2 items-center gap-x-2 rounded-[20px] bg-[rgba(255,255,255,0.1)] px-4 backdrop-blur-[12px] sm:w-fit sm:max-w-[500px]">
          {((type) => {
            switch (type) {
              case "success":
                return (
                  <Image
                    width={16}
                    height={16}
                    className="tip-icon"
                    src="/icons/tip-success.svg"
                    loading="lazy"
                    alt=""
                  />
                );
              case "warning":
                return (
                  <Image
                    src="/icons/lamp.svg"
                    width={24}
                    height={24}
                    alt="info"
                    className="mr-2"
                    loading="lazy"
                  />
                );
              case "error":
                return (
                  <Image
                    width={16}
                    height={16}
                    className="tip-icon"
                    src="/icons/tip.svg"
                    loading="lazy"
                    alt=""
                  />
                );
              default:
                return null;
            }
          })(type)}
          <span className="text-sm font-semibold leading-6 text-white opacity-60 sm:text-base">
            {message}
          </span>
        </div>
      ) : null}
    </>
  );
}
