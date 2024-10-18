import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

export function ConnectBtn({
  isConnect,
  handleConnect,
  handleDisconnect,
}: {
  isConnect: boolean;
  handleConnect: () => void;
  handleDisconnect: () => void;
}) {
  const T = useTranslations("Common");
  const [isHover, setIsHover] = useState(false);

  return isConnect ? (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleDisconnect}
      className="ml-0 mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] hover:border-[#ff5a5a] hover:bg-[#FF5A5A] md:ml-4 md:mt-0 md:w-[200px]"
    >
      {isHover ? (
        <>
          <Image
            src="/icons/unlink-white.svg"
            width={24}
            height={24}
            alt="save"
          />
          <div className="ml-1 text-base leading-6">{T("Disconnect")}</div>
        </>
      ) : (
        <>
          <Image src="/icons/linked.svg" width={24} height={24} alt="save" />
          <div className="ml-1 text-base leading-6 ">{T("Connected")}</div>
        </>
      )}
    </div>
  ) : (
    <div
      onClick={handleConnect}
      className="ml-0 mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] hover:brightness-75 jm:ml-4 jm:mt-0 jm:w-[200px]"
    >
      <Image src="/icons/link.svg" width={24} height={24} alt="save" />
      <div className="ml-1 text-base leading-6">{T("Connect")}</div>
    </div>
  );
}
