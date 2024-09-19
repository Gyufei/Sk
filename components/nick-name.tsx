import Image from "next/image";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai/react";

import { Input } from "@/components/ui/input";

import { UuidAtom } from "@/lib/state";
import { useFetchUserInfo } from "@/lib/use-fetch-user-info";
import fetcher from "@/lib/fetcher";
import { ApiHost } from "@/lib/path";

export function NickName({ nickName }: { nickName: string }) {
  const uuid = useAtomValue(UuidAtom);
  const [name, setName] = useState(nickName);
  const [isEditName, setIsEditName] = useState(false);

  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setName(nickName);
  }, [nickName]);

  const { getUserInfo } = useFetchUserInfo();

  function handleBlur() {
    if (!name) {
      setName(nickName);
      setIsValid(true);
      setIsEditName(false);
      return;
    }

    if (!checkRegex(name)) {
      setIsValid(false);
      return;
    }

    setIsEditName(false);
    if (name) {
      saveName(name);
    }
  }

  function checkRegex(v: string) {
    const regex = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,15}$/g;

    return regex.test(v);
  }

  async function saveName(n: string) {
    if (!uuid) return;

    const res: any = await fetcher(`${ApiHost}/user/nick_name`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        nick_name: n,
      }),
    });
    console.log(res);

    getUserInfo();
  }

  function handleKeyDown(event: any) {
    if (event.keyCode === 13) {
      handleBlur();
    }
  }

  return (
    <>
      {isEditName ? (
        <Input
          onKeyDown={handleKeyDown}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          data-error={!isValid}
          className="h-[24px] w-full rounded-none border-b border-[rgba(255,255,255,0.2)] bg-transparent pl-0 text-base data-[error=true]:border-[#FF5A5A]  md:w-[80px]"
        />
      ) : (
        <div className="flex items-center justify-between md:justify-start">
          <div className="h-[24px] text-base leading-6 text-white">{name}</div>
          <Image
            onClick={() => setIsEditName(true)}
            className="ml-2 cursor-pointer text-white"
            src="/icons/edit.svg"
            width={12}
            height={12}
            alt=""
          />
        </div>
      )}
    </>
  );
}
