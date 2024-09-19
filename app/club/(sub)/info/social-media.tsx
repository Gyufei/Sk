import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { InputWithClear } from "../shipping/input-with-clear";
import { useSaveSocial } from "@/lib/use-save-social";
import { useLang } from "@/lib/use-lang";
import { useAtomValue } from "jotai";
import { useFetchUserInfo } from "@/lib/use-fetch-user-info";

export function SocialMedia() {
  const { isEn } = useLang();
  return (
    <div className="mt-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur md:rounded-[18px] md:p-[20px]">
      <div className="mb-7 text-xl leading-[30px] text-white">
        {isEn ? "Social Media" : "社交媒体"}
      </div>
      <Email />
      <Discord />
      <Tg />
      <Twitter />
      <Github />
    </div>
  );
}

function Twitter() {
  const { data: userInfo } = useFetchUserInfo();
  const [x, setX] = useState(userInfo?.social_media?.Twitter || "");
  const [isCheck, setIsCheck] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const placeHolderText = "https://x.com/";

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
    () => !isValid || !x || (x && !checkRegex(x)),
    [isValid, x],
  );

  function checkRegex(x: string) {
    const regex = /^https:\/\/(twitter|x).com\/@?[a-zA-Z0-9_-]{2,15}$/g;
    const allValue = `${placeHolderText}${x}`;

    return regex.test(allValue);
  }

  const { saveSocial } = useSaveSocial();

  function handleBlur() {
    if (!x) return;

    setIsValid(checkRegex(x));
  }

  function handleSave() {
    if (disabled) return;
    const allX = `${placeHolderText}${x}`;
    saveSocial({ name: "Twitter", data: allX });
    setIsCheck(true);
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
          placeHolderText={placeHolderText}
          placeHolder="|  your id"
          onValueChange={(v) => handleXInput(v)}
          isSign={false && isCheck}
          conClass="md:ml-4 ml-0 flex-1 w-full md:w-auto"
          onBlur={handleBlur}
        />
        <MobileInValidTpl isValid={isValid} text="Invalid X (Twitter) link." />
        <SaveBtn disabled={disabled} handleSave={handleSave} />
      </div>
      <PcInvalidTpl isValid={isValid} text="Invalid X (Twitter) link." />
    </div>
  );
}

function Email() {
  const { data: userInfo } = useFetchUserInfo();
  const [email, setEmail] = useState(userInfo?.social_media?.Email || "");
  const [isCheck, setIsCheck] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const disabled = useMemo(
    () => !isValid || !email || (email && !checkRegex(email)),
    [isValid, email],
  );

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

  function handleSave() {
    if (!email || !isValid) return;
    saveSocial({ name: "Email", data: email });
    setIsCheck(true);
  }

  function handleBlur() {
    if (!email) return;

    setIsValid(checkRegex(email));
  }

  function checkRegex(x: string) {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;

    return regex.test(x);
  }

  return (
    <div className="flex flex-col">
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
        <SaveBtn disabled={disabled} handleSave={handleSave} />
      </div>
      <PcInvalidTpl isValid={isValid} text="Invalid Email." />
    </div>
  );
}

function Discord() {
  const { data: userInfo } = useFetchUserInfo();
  const [discord, setDiscord] = useState(userInfo?.social_media?.Discord || "");
  const [isValid, setIsValid] = useState(true);

  const disabled = useMemo(
    () => !isValid || !discord || (discord && !checkRegex(discord)),
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

    setIsValid(checkRegex(discord));
  }

  function checkRegex(x: string) {
    const regex = /^@?[a-zA-Z0-9_-]{5,40}$/g;

    return regex.test(x);
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

function Tg() {
  const placeHolderText = "https://telegram.org/";
  const { data: userInfo } = useFetchUserInfo();
  const [tg, setTg] = useState(userInfo?.social_media?.Telegram || "");
  const [isValid, setIsValid] = useState(true);

  const disabled = useMemo(
    () => !isValid || !tg || (tg && !checkRegex(tg)),
    [isValid, tg],
  );

  useEffect(() => {
    if (userInfo?.social_media) {
      const tg = userInfo?.social_media?.Telegram || "";
      setTg(tg);
    }
  }, [userInfo]);

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

    setIsValid(checkRegex(tg));
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (disabled) return;
    saveSocial({ name: "Telegram", data: tg });
  }

  function checkRegex(x: string) {
    const regex = /^@?[a-zA-Z0-9_]{5,32}$/g;

    return regex.test(x);
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
        <SaveBtn disabled={disabled} handleSave={handleSave} />
      </div>
      <PcInvalidTpl isValid={isValid} text="Invalid Telegram." />
    </div>
  );
}

function Github() {
  const placeHolderText = "https://github.com/";
  const { data: userInfo } = useFetchUserInfo();
  const [github, setGithub] = useState(userInfo?.social_media?.Github || "");
  const [isValid, setIsValid] = useState(true);

  const disabled = useMemo(
    () => !isValid || !github || (github && !checkRegex(github)),
    [isValid, github],
  );

  useEffect(() => {
    if (userInfo?.social_media) {
      const g = userInfo?.social_media?.Github
        ? userInfo?.social_media?.Github.replace(placeHolderText, "")
        : "";
      setGithub(g);
    }
  }, [userInfo]);

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

    setIsValid(checkRegex(github));
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (disabled) return;

    const allValue = `${placeHolderText}${github}`;
    saveSocial({ name: "Github", data: allValue });
  }

  function checkRegex(x: string) {
    const regex = /^https:\/\/github.com\/[a-zA-Z0-9_-]{1,40}$/g;
    const allValue = `${placeHolderText}${x}`;

    return regex.test(allValue);
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

function SaveBtn({
  disabled,
  handleSave,
}: {
  disabled: boolean;
  handleSave: () => void;
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      data-disabled={disabled}
      onClick={handleSave}
      className="ml-0 mt-[10px] flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=false]:hover:bg-[#fff] md:ml-4  md:mt-0 md:w-12"
    >
      <Image
        src={isHover ? "/icons/save-black.svg" : "/icons/save.svg"}
        width={24}
        height={24}
        alt="save"
      />
      <div className="ml-1 text-base leading-6 md:hidden">Save</div>
    </div>
  );
}

function InvalidTpl({ isValid, text }: { isValid: boolean; text: string }) {
  if (isValid) return null;
  return <div className="block text-sm leading-5 text-[#FF5A5A]">{text}</div>;
}

function MobileInValidTpl({
  isValid,
  text,
}: {
  isValid: boolean;
  text: string;
}) {
  if (isValid) return null;

  return (
    <div className="my-1 md:hidden">
      <InvalidTpl isValid={isValid} text={text} />
    </div>
  );
}

function PcInvalidTpl({ isValid, text }: { isValid: boolean; text: string }) {
  if (isValid) return null;

  return (
    <div className="mt-3 hidden pl-[155px] md:block">
      <InvalidTpl isValid={isValid} text={text} />
    </div>
  );
}
