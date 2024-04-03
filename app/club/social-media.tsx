import Image from "next/image";
import { useEffect, useState } from "react";
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
    setX(val);
    setIsCheck(true);
    setIsValid(true);
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (!x || !isValid) return;
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
          onClick={handleSave}
          className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)]"
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

  function handleXInput(val: string) {
    setEmail(val);
    setIsCheck(true);
    setIsValid(true);
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

  return (
    <div className="mt-2 flex flex-col">
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
          onClick={handleSave}
          className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)]"
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

  useEffect(() => {
    if (userInfo?.social_media) {
      setDiscord(userInfo?.social_media?.Discord || "");
    }
  }, [userInfo]);

  function handleXInput(val: string) {
    setDiscord(val);
    setIsValid(true);
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (!discord || !isValid) return;
    saveSocial({ name: "Discord", data: discord });
  }

  return (
    <div className="mt-2 flex flex-col">
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
          onClick={handleSave}
          className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)]"
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

  useEffect(() => {
    if (userInfo?.social_media) {
      setTg(userInfo?.social_media?.Telegram || "");
    }
  }, [userInfo]);

  function handleXInput(val: string) {
    setTg(val);
    setIsValid(true);
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (!tg || !isValid) return;
    saveSocial({ name: "Telegram", data: tg });
  }

  return (
    <div className="mt-2 flex flex-col">
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
          onClick={handleSave}
          className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)]"
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

  useEffect(() => {
    if (userInfo?.social_media) {
      setGithub(userInfo?.social_media?.Github || "");
    }
  }, [userInfo]);

  function handleXInput(val: string) {
    setGithub(val);
    setIsValid(true);
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (!github || !isValid) return;
    saveSocial({ name: "Github", data: github });
  }

  return (
    <div className="mt-2 flex flex-col">
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
          onClick={handleSave}
          className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)]"
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
