import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { InputWithClear } from "./input-with-clear";

export function SocialMedia() {
  return (
    <div className="mt-12">
      <div className="mb-7 text-xl leading-[30px] text-white">Social Media</div>
      <Twitter />
      <Email />
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
    setIsValid(false);
  }

  function handleSign() {}

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="./icons/x.svg" width={30} height={30} alt="" />
          <div className="leading-6 text-[#d6d6d6]">X (Twitter)</div>
        </div>
        <InputWithClear
          isError={true}
          value={x}
          onValueChange={(v) => handleXInput(v)}
          isSign={isCheck}
          conClass="ml-4 flex-1"
        />
        <div
          onClick={handleSign}
          className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)]"
        >
          <Image src="./icons/save.svg" width={24} height={24} alt="save" />
        </div>
      </div>
      <div className="ml-[150px] mt-3 text-sm leading-5 text-[#FF5A5A]">
        Invalid X (Twitter) link.
      </div>
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
    setIsValid(false);
  }

  function handleSign() {}

  return (
    <div className="mt-2 flex flex-col">
      <div className="flex items-center">
        <div className="flex w-[140px] items-center space-x-2">
          <Image src="./icons/email.svg" width={30} height={30} alt="" />
          <div className="leading-6 text-[#d6d6d6]">Email</div>
        </div>
        <InputWithClear
          isError={true}
          value={email}
          onValueChange={(v) => handleXInput(v)}
          isSign={isCheck}
          conClass="ml-4 flex-1"
        />
        <div
          onClick={handleSign}
          className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)]"
        >
          <Image src="./icons/save.svg" width={24} height={24} alt="save" />
        </div>
      </div>
      <div className="ml-[155px] mt-3 text-sm leading-5 text-[#FF5A5A]">
        Invalid X (Twitter) link.
      </div>
    </div>
  );
}
