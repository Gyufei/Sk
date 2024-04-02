import Image from "next/image";
import { useState } from "react";
import { InputWithClear } from "./input-with-clear";
import { useSaveSocial } from "@/lib/use-save-social";
import { useLang } from "@/lib/use-lang";

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
  const [x, setX] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [isValid, setIsValid] = useState(true);

  function handleXInput(val: string) {
    setX(val);
    setIsCheck(true);
    setIsValid(true);
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (!x || !isValid) return;
    const res = saveSocial({ name: "Twitter", data: x });
    console.log(res);
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
  const [email, setEmail] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [isValid, setIsValid] = useState(true);

  function handleXInput(val: string) {
    setEmail(val);
    setIsCheck(true);
    setIsValid(true);
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (!email || !isValid) return;
    const res = saveSocial({ name: "Email", data: email });
    console.log(res);
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
  const [discord, setDiscord] = useState("");
  const [isValid, setIsValid] = useState(true);

  function handleXInput(val: string) {
    setDiscord(val);
    setIsValid(true);
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (!discord || !isValid) return;
    const res = saveSocial({ name: "Discord", data: discord });
    console.log(res);
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
  const [tg, setTg] = useState("");
  const [isValid, setIsValid] = useState(true);

  function handleXInput(val: string) {
    setTg(val);
    setIsValid(true);
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (!tg || !isValid) return;
    const res = saveSocial({ name: "Telegram", data: tg });
    console.log(res);
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
  const [github, setGithub] = useState("");
  const [isValid, setIsValid] = useState(true);

  function handleXInput(val: string) {
    setGithub(val);
    setIsValid(false);
  }

  const { saveSocial } = useSaveSocial();

  function handleSave() {
    if (!github || !isValid) return;
    const res = saveSocial({ name: "Github", data: github });
    console.log(res);
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
