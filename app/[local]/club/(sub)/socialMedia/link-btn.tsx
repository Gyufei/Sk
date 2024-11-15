import Image from "next/image";
import { useState } from "react";

export function LinkBtn({
  onClick,
  disabled,
  isConnected,
}: {
  onClick: () => void;
  disabled: boolean;
  isConnected: boolean;
}) {
  const [isHover, setIsHover] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  const showSrc = isConnected
    ? isHover
      ? "/icons/unlink-white.svg"
      : "/icons/linked.svg"
    : isHover
    ? "/icons/link-black.svg"
    : "/icons/link.svg";

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleClick}
      data-disabled={disabled}
      data-connected={isConnected}
      className="ml-0 mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[connected=true]:hover:border-[#FF5A5A] data-[connected=true]:hover:bg-[#FF5A5A] data-[disabled=false]:hover:bg-[#fff] md:ml-4 md:mt-0 md:w-12"
    >
      <Image src={showSrc} width={24} height={24} alt="save" />
      <div className="ml-1 text-base leading-6 md:hidden">
        {isConnected ? "Disconnect" : "Connect"}
      </div>
    </div>
  );
}
