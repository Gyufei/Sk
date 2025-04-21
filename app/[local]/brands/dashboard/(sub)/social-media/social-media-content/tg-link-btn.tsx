import { useEffect, useState } from "react";
import { LinkBtn } from "../link-btn";
import { TgConfig } from "@/lib/const/config";

export function TgLinkBtn({
  disabled,
  isConnected,
  onSave,
}: {
  disabled: boolean;
  isConnected: boolean;
  onSave: (user: any) => void;
}) {
  const [scriptLoad, setScriptLoad] = useState(false);

  function AddTelegramWidget() {
    return new Promise((resolve, reject) => {
      if (scriptLoad) {
        resolve("success");
        return;
      }

      const div = document.createElement("div");
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?10";

      script.onload = function () {
        resolve("success");
        document.body.removeChild(div);
      };

      script.onerror = function () {
        reject(new Error("unable to load"));
      };

      script.setAttribute("data-telegram-login", TgConfig.botName || "");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-request-access", "write");
      div.style.display = "none";
      div.appendChild(script);
      document.body.appendChild(div);
    });
  }

  useEffect(() => {
    function onTelegramAuth(user: any) {
      console.log("user", user);
      onSave(user);
    }

    (window as any).onTelegramAuth = onTelegramAuth;

    AddTelegramWidget().then(() => {
      setScriptLoad(true);
    });
  }, []);

  async function handleClick() {
    if (isConnected) {
      onSave(null);
      return;
    }

    if (!scriptLoad) {
      await AddTelegramWidget();
    }

    (window as any)?.Telegram?.Login?.auth(
      {
        bot_id: TgConfig.botId,
        method: "POST",
        origin: window.location.origin,
      },
      (user: any) => {
        if (!user || !user?.id) {
          return;
        }
        onSave(user);
      },
    );
  }

  return (
    <>
      <LinkBtn
        onClick={handleClick}
        disabled={disabled}
        isConnected={isConnected}
      />
    </>
  );
}
