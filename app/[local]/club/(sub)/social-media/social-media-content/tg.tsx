import { InputWithClear } from "@/components/input-with-clear";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useSaveSocial } from "@/lib/api/use-save-social";
import { checkTgRegex } from "@/lib/utils/utils";
import Image from "next/image";
import { useState, useMemo, useEffect, useContext } from "react";
import { MobileInValidTpl, PcInvalidTpl } from "@/components/invalid-tpl";
import { SaveBtn } from "./save-btn";
import { GlobalMsgContext } from "@/components/global-msg-context";
import { EyeToggleBtn, useEyeToggle } from "./eye-toggle-btn";

export function Tg() {
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const placeHolderText = "https://t.me/";
  const { data: userInfo } = useFetchUserInfo();
  const [tg, setTg] = useState(userInfo?.social_media?.Telegram || "");
  const [isValid, setIsValid] = useState(true);

  const { data: saveRes, trigger: saveSocial } = useSaveSocial();
  const { eyeState, handleToggle } = useEyeToggle({ keyword: "tgEyeShow" });

  const disabled = useMemo(
    () => !isValid || !tg || (tg && !checkTgRegex(tg)),
    [isValid, tg],
  );

  useEffect(() => {
    if (userInfo?.social_media) {
      const tg = userInfo?.social_media?.Telegram || "";
      setTg(tg);
    }
  }, [userInfo]);

  useEffect(() => {
    if (saveRes) {
      setIsValid(true);
      setGlobalMessage({
        type: "success",
        message: "Saved successfully",
      });
    }
  }, [saveRes]);

  function handleXInput(val: string) {
    if (!val) {
      setTg(val);
      setIsValid(true);
      return;
    }

    const trimedVal = val.replace(/(^\s*)|(\s*$)/g, "");
    setTg(trimedVal);
  }

  function handleBlur() {
    if (!tg) return;

    setIsValid(checkTgRegex(tg));
  }

  function handleSave() {
    if (disabled) return;
    saveSocial({ name: "Telegram", data: tg } as any);
  }

  return (
    <div className="mt-[30px] sm:mt-4 flex flex-col">
      <div className="relative flex flex-col items-start sm:flex-row sm:items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="/icons/tg.svg" width={30} height={30} alt="" className={"w-[24px] h-[24px] sm:w-[30px] sm:h-[30px]"}/>
          <div className="text-base leading-[24px] text-[#d6d6d6]">Telegram</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={tg}
          type={eyeState ? "password" : "text"}
          placeHolderText={placeHolderText}
          placeHolder="|  your id"
          onValueChange={(v) => handleXInput(v)}
          isSign={false}
          conClass="sm:ml-4 ml-0 flex-1 w-full sm:w-auto"
          inputClass="text-base"
          onBlur={handleBlur}
        />
        <MobileInValidTpl isValid={isValid} text="Invalid Telegram." />
        <SaveBtn
          disabled={disabled}
          handleSave={handleSave}
          className="w-full"
        />
        <EyeToggleBtn eyeState={eyeState} handleToggle={handleToggle} />
      </div>
      <PcInvalidTpl isValid={isValid} text="Invalid Telegram." />
    </div>
  );
}
