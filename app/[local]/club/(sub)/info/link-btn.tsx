import Image from "next/image";
import { useState } from "react";

export function LinkBtn({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick}
      data-disabled={disabled}
      className="ml-0 mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=false]:hover:bg-[#fff] md:ml-4 md:mt-0 md:w-12"
    >
      <Image
        src={isHover && !disabled ? "/icons/link-black.svg" : "/icons/link.svg"}
        width={24}
        height={24}
        alt="save"
      />
      <div className="ml-1 text-base leading-6 md:hidden">Connect</div>
    </div>
  );
}

export function UnlinkBtn({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick}
      data-disabled={disabled}
      className="ml-0 mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=false]:hover:border-[#FF5A5A] data-[disabled=false]:hover:bg-[#FF5A5A] md:ml-4 md:mt-0 md:w-12"
    >
      <Image
        src={
          isHover && !disabled ? "/icons/unlink-white.svg" : "/icons/unlink.svg"
        }
        width={24}
        height={24}
        alt="save"
      />
      <div className="ml-1 text-base leading-6 md:hidden">Disconnect</div>
    </div>
  );
}
