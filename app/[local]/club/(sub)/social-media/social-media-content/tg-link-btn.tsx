import { useEffect, useState } from "react";
import { LinkBtn } from "../link-btn";

export function TgLinkBtn({
  disabled,
  isConnected,
}: {
  disabled: boolean;
  isConnected: boolean;
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

      script.setAttribute("data-telegram-login", "samplebot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-request-access", "write");

      div.style.display = "none";
      div.appendChild(script);
      document.body.appendChild(div);
    });
  }

  useEffect(() => {
    AddTelegramWidget().then(() => {
      setScriptLoad(true);
    });
  }, []);

  async function handleClick() {
    if (!scriptLoad) {
      await AddTelegramWidget();
    }
    (window as any)?.Telegram?.Login?.auth({
      // bot_id: "547043436",
      bot_id: "7461663146",
      method: "POST",
      // origin: window.location.origin,
      // origin: "https://core.telegram.org",
      origin: "https://www.okx.com",
    });
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
