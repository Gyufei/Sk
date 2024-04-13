import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { InputWithClear } from "./input-with-clear";
import { useSaveSocial } from "@/lib/use-save-social";
import { useLang } from "@/lib/use-lang";
import { useAtomValue } from "jotai";
import { UserInfoAtom } from "@/lib/state";

export function SocialMedia() {
  const { isEn } = useLang();
  return (
    <div className="mt-12">
      <div className="mb-7 text-xl leading-[30px] text-white">
        {isEn ? "Social Media" : "社交媒体"}
      </div>
      <Twitter />
      <Email />
      <Discord />
      <Tg />
      <Github />
    </div>
  );
}

function Twitter() {
  const userInfo = useAtomValue(UserInfoAtom);
  const [x, setX] = useState(userInfo?.social_media?.Twitter || "");
  const [isCheck, setIsCheck] = useState(false);
  const [isValid, setIsValid] = useState(true);

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

    setX(val);
  }

  const disabled = useMemo(
    () => !isValid || !x || (x && !checkRegex(x)),
    [isValid, x],
  );

  function checkRegex(x: string) {
    const regex = /^https:\/\/(twitter|x).com\/@?[a-zA-Z0-9_]{2,15}$/g;

    return regex.test(x);
  }

  const { saveSocial } = useSaveSocial();

  function handleBlur() {
    if (!x) return;

    setIsValid(checkRegex(x));
  }

  function handleSave() {
    if (disabled) return;
    saveSocial({ name: "Twitter", data: x });
    setIsCheck(true);
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="./icons/x.svg" width={30} height={30} alt="" />
          <div className="text-base leading-6 text-[#d6d6d6]">X (Twitter)</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={x}
          placeHolder="https://x.com/yourid"
          onValueChange={(v) => handleXInput(v)}
          isSign={false && isCheck}
          conClass="ml-4 flex-1"
          onBlur={handleBlur}
        />
        <div
          data-disabled={disabled}
          onClick={handleSave}
          className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
        >
          <Image src="./icons/save.svg" width={24} height={24} alt="save" />
        </div>
      </div>
      {!isValid && (
        <div className="ml-[150px] mt-3 text-sm leading-5 text-[#FF5A5A]">
          Invalid X (Twitter) link.
        </div>
      )}
    </div>
  );
}

function Email() {
  const userInfo = useAtomValue(UserInfoAtom);
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

    setEmail(val);
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
      /^[A-Za-z0-9-_\u4e00-\u9fa5.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;

    return regex.test(x);
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="./icons/email.svg" width={30} height={30} alt="" />
          <div className="text-base leading-6 text-[#d6d6d6]">Email</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={email}
          placeHolder="name@gmail.com"
          onValueChange={(v) => handleXInput(v)}
          isSign={false && isCheck}
          conClass="ml-4 flex-1"
          onBlur={handleBlur}
        />
        <div
          data-disabled={disabled}
          onClick={handleSave}
          className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)]  data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
        >
          <Image src="./icons/save.svg" width={24} height={24} alt="save" />
        </div>
      </div>
      {!isValid && (
        <div className="ml-[155px] mt-3 text-sm leading-5 text-[#FF5A5A]">
          Invalid Email.
        </div>
      )}
    </div>
  );
}

function Discord() {
  const userInfo = useAtomValue(UserInfoAtom);
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

    setDiscord(val);
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
    const regex = /^@?[a-zA-Z0-9_]{5,40}$/g;

    return regex.test(x);
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="./icons/discord.svg" width={30} height={30} alt="" />
          <div className="text-base leading-6 text-[#d6d6d6]">Discord</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={discord}
          placeHolder="@"
          onValueChange={(v) => handleXInput(v)}
          isSign={false}
          conClass="ml-4 flex-1"
          onBlur={handleBlur}
        />
        <div
          data-disabled={disabled}
          onClick={handleSave}
          className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)]  data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
        >
          <Image src="./icons/save.svg" width={24} height={24} alt="save" />
        </div>
      </div>
      {!isValid && (
        <div className="ml-[155px] mt-3 text-sm leading-5 text-[#FF5A5A]">
          Invalid Discord.
        </div>
      )}
    </div>
  );
}

function Tg() {
  const userInfo = useAtomValue(UserInfoAtom);
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

    setTg(val);
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
    const regex = /^@?[a-zA-Z0-9]{5,40}$/g;

    return regex.test(x);
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="./icons/tg.svg" width={30} height={30} alt="" />
          <div className="text-base leading-6 text-[#d6d6d6]">Telegram</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={tg}
          placeHolder="@"
          onValueChange={(v) => handleXInput(v)}
          isSign={false}
          conClass="ml-4 flex-1"
          onBlur={handleBlur}
        />
        <div
          data-disabled={disabled}
          onClick={handleSave}
          className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)]  data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
        >
          <Image src="./icons/save.svg" width={24} height={24} alt="save" />
        </div>
      </div>
      {!isValid && (
        <div className="ml-[155px] mt-3 text-sm leading-5 text-[#FF5A5A]">
          Invalid Telegram.
        </div>
      )}
    </div>
  );
}

function Github() {
  const userInfo = useAtomValue(UserInfoAtom);
  const [github, setGithub] = useState(userInfo?.social_media?.Github || "");
  const [isValid, setIsValid] = useState(true);

  const disabled = useMemo(
    () => !isValid || !github || (github && !checkRegex(github)),
    [isValid, github],
  );

  useEffect(() => {
    if (userInfo?.social_media) {
      setGithub(userInfo?.social_media?.Github || "");
    }
  }, [userInfo]);

  function handleXInput(val: string) {
    if (!val) {
      setGithub(val);
      setIsValid(true);
      return;
    }

    setGithub(val);
  }

  function handleBlur() {
    if (!github) return;

    setIsValid(checkRegex(github));
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (disabled) return;

    saveSocial({ name: "Github", data: github });
  }

  function checkRegex(x: string) {
    const regex = /^https:\/\/github.com\/[a-zA-Z0-9_]{1,40}$/g;

    return regex.test(x);
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="./icons/github.svg" width={30} height={30} alt="" />
          <div className="text-base leading-6 text-[#d6d6d6]">Github</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={github}
          placeHolder="https://github.com/yourid"
          onValueChange={(v) => handleXInput(v)}
          isSign={false}
          conClass="ml-4 flex-1"
          onBlur={handleBlur}
        />
        <div
          data-disabled={disabled}
          onClick={handleSave}
          className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)]  data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
        >
          <Image src="./icons/save.svg" width={24} height={24} alt="save" />
        </div>
      </div>
      {!isValid && (
        <div className="ml-[155px] mt-3 text-sm leading-5 text-[#FF5A5A]">
          Invalid Github.
        </div>
      )}
    </div>
  );
}
