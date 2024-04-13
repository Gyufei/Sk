import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai/react";
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
    <div className="text-[40px] leading-[60px] text-[#d6d6d6]">
      {isEditName ? (
        <Input
          onKeyDown={handleKeyDown}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          data-error={!isValid}
          className="h-[60px] w-[200px] rounded-none border-b border-[rgba(255,255,255,0.2)] bg-transparent pl-0 text-[40px]  data-[error=true]:border-[#FF5A5A]"
        />
      ) : (
        <div className="flex items-center">
          <div className="h-[60px] text-[40px] leading-[60px] text-[#d6d6d6]">
            {name}
          </div>
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
