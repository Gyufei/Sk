import { InputWithClear } from "@/components/input-with-clear";
import { useFetchUserInfo } from "@/lib/use-fetch-user-info";
import { useSaveSocial } from "@/lib/use-save-social";
import { checkEmailRegex } from "@/lib/utils";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { PcInvalidTpl, MobileInValidTpl } from "../invalid-tpl";
import { LinkBtn, UnlinkBtn } from "../link-btn";

export function Email() {
  const { data: userInfo } = useFetchUserInfo();
  const [email, setEmail] = useState(userInfo?.social_media?.Email || "");
  const [isCheck, setIsCheck] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const disabled = useMemo(
    () => !isValid || !email || (email && !checkEmailRegex(email)),
    [isValid, email],
  );

  const isLink = false;

  function handleXInput(val: string) {
    if (!val) {
      setEmail(val);
      setIsValid(true);
      return;
    }

    const trimedVal = val.replace(/(^\s*)|(\s*$)/g, "");
    setEmail(trimedVal);
  }

  useEffect(() => {
    if (userInfo?.social_media) {
      setEmail(userInfo?.social_media?.Email || "");
    }
  }, [userInfo]);

  const { saveSocial } = useSaveSocial();

  function handleBlur() {
    if (!email) return;

    setIsValid(checkEmailRegex(email));
  }

  function handleLink() {
    if (disabled) return;
    if (!email || !isValid) return;
    saveSocial({ name: "Email", data: email });
    setIsCheck(true);
  }

  function handleUnLink() {
    if (disabled) return;
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex flex-col items-start md:flex-row md:items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="/icons/email.svg" width={30} height={30} alt="" />
          <div className="text-base leading-6 text-[#d6d6d6]">Email</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={email}
          placeHolder="name@gmail.com"
          onValueChange={(v) => handleXInput(v)}
          isSign={false && isCheck}
          conClass="md:ml-4 ml-0 flex-1 w-full md:w-auto"
          onBlur={handleBlur}
        />
        <MobileInValidTpl isValid={isValid} text="Invalid Email." />
        {isLink ? (
          <UnlinkBtn onClick={handleUnLink} disabled={disabled} />
        ) : (
          <LinkBtn onClick={handleLink} disabled={disabled} />
        )}
      </div>
      <PcInvalidTpl isValid={isValid} text="Invalid Email." />
    </div>
  );
}
