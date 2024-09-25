import { InputWithClear } from "@/components/input-with-clear";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useSaveSocial } from "@/lib/api/use-save-social";
import { checkDiscordRegex } from "@/lib/utils/utils";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { PcInvalidTpl, MobileInValidTpl } from "../invalid-tpl";
import { SaveBtn } from "./save-btn";

export function Discord() {
  const { data: userInfo } = useFetchUserInfo();
  const [discord, setDiscord] = useState(userInfo?.social_media?.Discord || "");
  const [isValid, setIsValid] = useState(true);

  const disabled = useMemo(
    () => !isValid || !discord || (discord && !checkDiscordRegex(discord)),
    [isValid, discord],
  );

  useEffect(() => {
    if (userInfo?.social_media) {
      const uDiscord = userInfo?.social_media?.Discord || "";
      setDiscord(uDiscord);
    }
  }, [userInfo]);

  function handleXInput(val: string) {
    if (!val) {
      setDiscord(val);
      setIsValid(true);
      return;
    }

    const trimedVal = val.replace(/(^\s*)|(\s*$)/g, "");
    setDiscord(trimedVal);
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (disabled) return;
    const saveDiscord = discord.startsWith("@") ? discord.slice(1) : discord;
    saveSocial({ name: "Discord", data: saveDiscord });
  }

  function handleBlur() {
    if (!discord) return;

    setIsValid(checkDiscordRegex(discord));
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex flex-col items-start md:flex-row md:items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="/icons/discord.svg" width={30} height={30} alt="" />
          <div className="text-base leading-6 text-[#d6d6d6]">Discord</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={discord}
          placeHolder="your id"
          onValueChange={(v) => handleXInput(v)}
          isSign={false}
          conClass="md:ml-4 ml-0 flex-1 w-full md:w-auto"
          onBlur={handleBlur}
        />
        <MobileInValidTpl isValid={isValid} text="Invalid Discord." />
        <SaveBtn disabled={disabled} handleSave={handleSave} />
      </div>
      <PcInvalidTpl isValid={isValid} text="Invalid Discord." />
    </div>
  );
}
