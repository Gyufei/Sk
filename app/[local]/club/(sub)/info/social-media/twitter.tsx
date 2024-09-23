import { InputWithClear } from "@/components/input-with-clear";
import { useFetchUserInfo } from "@/lib/use-fetch-user-info";
import { useSaveSocial } from "@/lib/use-save-social";
import { checkTwitterRegex, twitterPlaceHolderText } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MobileInValidTpl, PcInvalidTpl } from "../invalid-tpl";
import { LinkBtn, UnlinkBtn } from "../link-btn";

export function Twitter() {
  const { data: userInfo } = useFetchUserInfo();
  const [x, setX] = useState(userInfo?.social_media?.Twitter || "");
  const [isCheck, setIsCheck] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const isLink = false;

  useEffect(() => {
    if (userInfo?.social_media) {
      setX(userInfo?.social_media?.Twitter || "");
    }
  }, [userInfo]);

  function handleXInput(val: string) {
    if (!val) {
      setX(val);
      setIsValid(true);
      return;
    }

    const trimedVal = val.replace(/(^\s*)|(\s*$)/g, "");
    setX(trimedVal);
  }

  const disabled = useMemo(
    () => !isValid || !x || (x && !checkTwitterRegex(x)),
    [isValid, x],
  );

  const { saveSocial } = useSaveSocial();

  function handleBlur() {
    if (!x) return;

    setIsValid(checkTwitterRegex(x));
  }

  function handleLink() {
    if (disabled) return;
    const allX = `${twitterPlaceHolderText}${x}`;
    saveSocial({ name: "Twitter", data: allX });
    setIsCheck(true);
  }

  function handleUnLink() {
    if (disabled) return;
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex flex-col items-start md:flex-row md:items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="/icons/x.svg" width={30} height={30} alt="" />
          <div className="text-base leading-6 text-[#fff]">X (Twitter)</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={x}
          placeHolderText={twitterPlaceHolderText}
          placeHolder="|  your id"
          onValueChange={(v) => handleXInput(v)}
          isSign={false && isCheck}
          conClass="md:ml-4 ml-0 flex-1 w-full md:w-auto"
          onBlur={handleBlur}
        />
        <MobileInValidTpl isValid={isValid} text="Invalid X (Twitter) link." />
        {isLink ? (
          <UnlinkBtn onClick={handleUnLink} disabled={disabled} />
        ) : (
          <LinkBtn onClick={handleLink} disabled={disabled} />
        )}
      </div>
      <PcInvalidTpl isValid={isValid} text="Invalid X (Twitter) link." />
    </div>
  );
}
