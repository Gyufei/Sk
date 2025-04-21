import { InputWithClear } from "@/components/input-with-clear";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useSaveSocial } from "@/lib/api/use-save-social";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { GlobalMsgContext } from "@/components/global-msg-context";
import { EyeToggleBtn, useEyeToggle } from "./eye-toggle-btn";
import { TgLinkBtn } from "./tg-link-btn";
import TgSuccessModal from "./tg-success-modal";

const placeHolderText = "https://t.me/";

export function Tg() {
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const { data: userInfo } = useFetchUserInfo();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [tgValue, setTgValue] = useState("");

  const { data: saveRes, trigger: saveSocial } = useSaveSocial();
  const { eyeState, handleToggle } = useEyeToggle({ keyword: "tgEyeShow" });

  const tg = userInfo?.social_media?.Telegram;
  const tgName = (tg as any)?.user_name || "";
  const isLink = userInfo?.social_media?.Telegram?.user_id && tgValue;
  // const isLink = true;
  const [saveData, setSaveData] = useState(null);

  useEffect(() => {
    if (tgName) {
      setTgValue(tgName);
    }
  }, [tgName]);

  useEffect(() => {
    if (saveData && saveRes) {
      setShowSuccessModal(true);
      setIsValid(true);
      setGlobalMessage({
        type: "success",
        message: "Saved successfully",
      });
    }
  }, [saveRes]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleSave(tgData: any) {
    setSaveData(tgData);
    saveSocial({ name: "Telegram", data: tgData } as any);
  }

  function handleChange(value: string) {
    setTgValue(value);
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
          isError={!isValid}
          value={tgValue}
          type={eyeState ? "password" : "text"}
          placeHolderText={placeHolderText}
          placeHolder="tg"
          onValueChange={() => {}}
          showLink={isLink}
          conClass="sm:ml-4 ml-0 flex-1 w-full sm:w-auto"
          inputClass="text-base"
          readOnly={true}
          showUnLink={!isLink}
          showClear={false}
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
