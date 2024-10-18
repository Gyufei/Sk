import { InputWithClear } from "@/components/input-with-clear";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useSaveSocial } from "@/lib/api/use-save-social";
import { checkTgRegex } from "@/lib/utils/utils";
import Image from "next/image";
import { useState, useMemo, useEffect, useContext } from "react";
import { PcInvalidTpl, MobileInValidTpl } from "../invalid-tpl";
import { SaveBtn } from "./save-btn";
import { GlobalMsgContext } from "@/components/global-msg-context";

export function Tg() {
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const placeHolderText = "https://telegram.org/";
  const { data: userInfo } = useFetchUserInfo();
  const [tg, setTg] = useState(userInfo?.social_media?.Telegram || "");
  const [isValid, setIsValid] = useState(true);

  const { data: saveRes, trigger: saveSocial } = useSaveSocial();

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
    <div className="mt-4 flex flex-col">
      <div className="flex flex-col items-start md:flex-row md:items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="/icons/tg.svg" width={30} height={30} alt="" />
          <div className="text-base leading-6 text-[#d6d6d6]">Telegram</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={tg}
          placeHolderText={placeHolderText}
          placeHolder="|  your id"
          onValueChange={(v) => handleXInput(v)}
          isSign={false}
          conClass="md:ml-4 ml-0 flex-1 w-full md:w-auto"
          onBlur={handleBlur}
        />
        <MobileInValidTpl isValid={isValid} text="Invalid Telegram." />
        <SaveBtn disabled={disabled} handleSave={handleSave} className="w-full"/>
      </div>
      <PcInvalidTpl isValid={isValid} text="Invalid Telegram." />
    </div>
  );
}
