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

  const colorMap = {
    success: {
      bg: "#D8F0E9",
      border: "#85DFC4",
      icon: "#070709",
    },
    warning: {
      bg: "#F1E5D1",
      border: "#DFCA9C",
      icon: "#B38828",
    },
    error: {
      bg: "#F8DEDA",
      border: "#DEA69C",
      icon: "black",
    },
  };

  return (
    <>
      {message && type ? (
        <div
          className="tip-con fixed bottom-6 left-1/2 z-[1000] mt-4 flex -translate-x-1/2 items-center gap-x-2 rounded-md border px-5 py-3"
          style={{
            color: colorMap[type].icon,
            backgroundColor: colorMap[type].bg,
            borderColor: colorMap[type].border,
          }}
        >
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
                    width={16}
                    height={16}
                    className="tip-icon"
                    src="/icons/tip-info.svg"
                    loading="lazy"
                    alt=""
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
          <div className="tip-text">{message}</div>
        </div>
      ) : null}
    </>
  );
}
