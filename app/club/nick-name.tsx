import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function NickName({
  nickName,
  setNickName,
}: {
  nickName: string;
  setNickName: (_n: string) => void;
}) {
  const [name, setName] = useState(nickName);
  const [isEditName, setIsEditName] = useState(false);

  function handleBlur() {
    setIsEditName(false);
    if (name) {
      setNickName(name);
    }
  }

  function handleKeyDown(event: any) {
    if (event.keyCode === 13) {
      handleBlur();
    }
  }

  return (
    <div className="text-[40px] leading-[60px] text-[#d6d6d6]">
      {isEditName ? (
        <Input
          onKeyDown={handleKeyDown}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          className="h-[60px] w-[200px] rounded-none border-b border-[rgba(255,255,255,0.2)] bg-transparent  text-[40px]"
        />
      ) : (
        <div className="flex items-center">
          <div>{nickName}</div>
          <Image
            onClick={() => setIsEditName(true)}
            className="ml-2 mt-4 cursor-pointer text-white"
            src="./icons/edit.svg"
            width={24}
            height={24}
            alt=""
          />
        </div>
      )}
    </div>
  );
}
