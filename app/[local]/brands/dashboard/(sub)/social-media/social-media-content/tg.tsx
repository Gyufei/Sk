import { InputWithClear } from "@/components/input-with-clear";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useSaveSocial } from "@/lib/api/use-save-social";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { GlobalMsgContext } from "@/components/global-msg-context";
import { EyeToggleBtn, useEyeToggle } from "./eye-toggle-btn";
import { TgLinkBtn } from "./tg-link-btn";
import TgSuccessModal from "./tg-success-modal";
import { TgConfig } from "@/lib/const/config";

const placeHolderText = "https://t.me/";

export function Tg() {
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const { data: userInfo } = useFetchUserInfo();

  const { data: saveRes, trigger: saveSocial } = useSaveSocial();
  const { eyeState, handleToggle } = useEyeToggle({ keyword: "tgEyeShow" });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [tgValue, setTgValue] = useState("");
  const [saveData, setSaveData] = useState(null);

  const tg = userInfo?.social_media?.Telegram;
  const isLink = userInfo?.social_media?.Telegram?.user_id && tgValue;

  useEffect(() => {
    if (typeof tg === "string") {
      setTgValue(tg);
      return;
    }

    if (tg?.user_name) {
      setTgValue(tg?.user_name);
    }
  }, [tg]);

  useEffect(() => {
    if (saveData && saveRes) {
      setShowSuccessModal(true);
      setGlobalMessage({
        type: "success",
        message: "Saved successfully",
      });
      window.open(TgConfig.tgBotUrl, "_blank");
    }
  }, [saveRes]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleSave(tgData: any) {
    setSaveData(tgData);
    saveSocial({ name: "Telegram", data: tgData } as any);
  }

  function handleChange(value: string | Record<string, string>) {
    setTgValue(
      typeof value === "string"
        ? value
        : `${value?.last_name || ""}${value?.first_name || ""}`,
    );
    handleSave(value);
  }

  return (
    <div className="mt-[30px] flex flex-col sm:mt-4">
      <div className="relative flex flex-col items-start sm:flex-row sm:items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image
            src="/icons/tg.svg"
            width={30}
            height={30}
            alt=""
            className={"h-[24px] w-[24px] sm:h-[30px] sm:w-[30px]"}
          />
          <div className="text-base leading-[24px] text-[#d6d6d6]">
            Telegram
          </div>
        </div>
        <InputWithClear
          isError={false}
          readOnly={true}
          value={tgValue}
          type={eyeState ? "password" : "text"}
          placeHolderText={placeHolderText}
          placeHolder="tg"
          onValueChange={() => {}}
          showUnLink={!isLink}
          showLink={isLink}
          showClear={false}
          conClass="sm:ml-4 ml-0 flex-1 w-full sm:w-auto"
          inputClass="text-base"
        />
        <TgLinkBtn
          disabled={false}
          isConnected={!!tgValue && isLink}
          onSave={handleChange}
        />
        <EyeToggleBtn eyeState={eyeState} handleToggle={handleToggle} />
      </div>
      <TgSuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
      />
    </div>
  );
}
