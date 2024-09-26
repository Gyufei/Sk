import { InputWithClear } from "@/components/input-with-clear";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useSaveSocial } from "@/lib/api/use-save-social";
import { checkGithubRegex, githubPlaceHolderText } from "@/lib/utils/utils";
import Image from "next/image";
import { useState, useMemo, useEffect, useContext } from "react";
import { PcInvalidTpl, MobileInValidTpl } from "../invalid-tpl";
import { SaveBtn } from "./save-btn";
import { GlobalMsgContext } from "@/components/global-msg-context";

export function Github() {
  const { setGlobalMessage } = useContext(GlobalMsgContext);

  const { data: userInfo } = useFetchUserInfo();
  const [github, setGithub] = useState(userInfo?.social_media?.Github || "");
  const [isValid, setIsValid] = useState(true);
  const { data: saveRes, trigger: saveSocial } = useSaveSocial();

  const disabled = useMemo(
    () => !isValid || !github || (github && !checkGithubRegex(github)),
    [isValid, github],
  );

  useEffect(() => {
    if (userInfo?.social_media) {
      const g = userInfo?.social_media?.Github
        ? userInfo?.social_media?.Github.replace(githubPlaceHolderText, "")
        : "";
      setGithub(g);
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
      setGithub(val);
      setIsValid(true);
      return;
    }

    const trimedVal = val.replace(/(^\s*)|(\s*$)/g, "");
    setGithub(trimedVal);
  }

  function handleBlur() {
    if (!github) return;

    setIsValid(checkGithubRegex(github));
  }

  function handleSave() {
    if (disabled) return;

    const allValue = `${githubPlaceHolderText}${github}`;
    saveSocial({ name: "Github", data: allValue } as any);
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex flex-col items-start md:flex-row md:items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="/icons/github.svg" width={30} height={30} alt="" />
          <div className="text-base leading-6 text-[#d6d6d6]">Github</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={github}
          placeHolderText="https://github.com/"
          placeHolder="|  your id"
          onValueChange={(v) => handleXInput(v)}
          isSign={false}
          conClass="md:ml-4 ml-0 flex-1 w-full md:w-auto"
          onBlur={handleBlur}
        />
        <MobileInValidTpl isValid={isValid} text="Invalid Github." />
        <SaveBtn disabled={disabled} handleSave={handleSave} />
      </div>
      <PcInvalidTpl isValid={isValid} text="Invalid Github." />
    </div>
  );
}
