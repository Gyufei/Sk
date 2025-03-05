import { useEffect, useState } from "react";
import { LinkBtn } from "../link-btn";

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

      script.setAttribute("data-telegram-login", "Juu17SiteBot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-request-access", "write");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
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
    if (!scriptLoad) {
      await AddTelegramWidget();
    }
    (window as any)?.Telegram?.Login?.auth(
      {
        bot_id: "7905537340",
        method: "POST",
        origin: window.location.origin,
      },
      (user: any) => {
        console.log("user", user);
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
