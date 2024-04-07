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
    setIsValid(checkRegex(val));
  }

  const disabled = useMemo(() => !isValid || !x, [isValid, x]);

  function checkRegex(x: string) {
    const regex = /http:\/\/(twitter|x).com\/@?[a-zA-Z0-9_]{2,15}/;

    return regex.test(x);
  }

  const { saveSocial } = useSaveSocial();

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
          <div className="leading-6 text-[#d6d6d6]">X (Twitter)</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={x}
          onValueChange={(v) => handleXInput(v)}
          isSign={isCheck}
          conClass="ml-4 flex-1"
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

  const disabled = useMemo(() => !isValid || !email, [isValid, email]);

  function handleXInput(val: string) {
    if (!val) {
      setEmail(val);
      setIsValid(true);
      return;
    }

    setEmail(val);
    setIsValid(checkRegex(val));
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

  function checkRegex(x: string) {
    const regex =
      /^[A-Za-z0-9-_\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

    return regex.test(x);
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="./icons/email.svg" width={30} height={30} alt="" />
          <div className="leading-6 text-[#d6d6d6]">Email</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={email}
          onValueChange={(v) => handleXInput(v)}
          isSign={isCheck}
          conClass="ml-4 flex-1"
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

  const disabled = useMemo(() => !isValid || !discord, [isValid, discord]);

  useEffect(() => {
    if (userInfo?.social_media) {
      const uDiscord = userInfo?.social_media?.Discord;

      const dData = uDiscord
        ? uDiscord.startWith("@")
          ? uDiscord
          : `@${uDiscord}`
        : "";
      setDiscord(dData);
    }
  }, [userInfo]);

  function handleXInput(val: string) {
    if (!val) {
      setDiscord(val);
      setIsValid(true);
      return;
    }

    setDiscord(val);
    setIsValid(checkRegex(val));
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (disabled) return;
    const saveDiscord = discord.startWith("@") ? discord.slice(1) : discord;
    saveSocial({ name: "Discord", data: saveDiscord });
  }

  function checkRegex(x: string) {
    const regex = /@?[a-zA-Z0-9_]{5,40}/;

    return regex.test(x);
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="./icons/discord.svg" width={30} height={30} alt="" />
          <div className="leading-6 text-[#d6d6d6]">Discord</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={discord}
          onValueChange={(v) => handleXInput(v)}
          isSign={false}
          conClass="ml-4 flex-1"
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

  const disabled = useMemo(() => !isValid || !tg, [isValid, tg]);

  useEffect(() => {
    if (userInfo?.social_media) {
      const tg = userInfo?.social_media?.Telegram;

      const tData = tg ? (tg.startWith("@") ? tg : `@${tg}`) : "";
      setTg(tData);
    }
  }, [userInfo]);

  function handleXInput(val: string) {
    if (!val) {
      setTg(val);
      setIsValid(true);
      return;
    }

    setTg(val);
    setIsValid(checkRegex(val));
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (disabled) return;
    saveSocial({ name: "Telegram", data: tg });
  }

  function checkRegex(x: string) {
    const regex = /@?[a-zA-Z0-9_]{5,40}/;

    return regex.test(x);
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="./icons/tg.svg" width={30} height={30} alt="" />
          <div className="leading-6 text-[#d6d6d6]">Telegram</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={tg}
          onValueChange={(v) => handleXInput(v)}
          isSign={false}
          conClass="ml-4 flex-1"
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

  const disabled = useMemo(() => !isValid || !github, [isValid, github]);

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
    setIsValid(checkRegex(val));
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (disabled) return;

    saveSocial({ name: "Github", data: github });
  }

  function checkRegex(x: string) {
    const regex = /http:\/\/github.com\/[a-zA-Z0-9_]{1,40}/;

    return regex.test(x);
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="./icons/github.svg" width={30} height={30} alt="" />
          <div className="leading-6 text-[#d6d6d6]">Github</div>
        </div>
        <InputWithClear
          isError={!isValid}
          value={github}
          onValueChange={(v) => handleXInput(v)}
          isSign={false}
          conClass="ml-4 flex-1"
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
