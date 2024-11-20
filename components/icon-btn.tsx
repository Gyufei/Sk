import Image from "next/image";
import { useState } from "react";

export function IconBtn({
  disabled = false,
  handleClick,
  className = "",
  defaulImage = "/icons/save.svg",
  hoverImage = "/icons/save-black.svg"
}: {
  disabled?: boolean;
  handleClick: () => void;
  className?: string;
  defaulImage?: string;
  hoverImage?: string;
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      data-disabled={disabled}
      onClick={handleClick}
      className={`w-12 ml-0 mt-[10px] flex h-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=false]:hover:bg-[#fff] md:ml-4  md:mt-0 md:w-12 ${className}`}
    >
      <Image
        src={isHover && !disabled ? hoverImage : defaulImage}
        width={24}
        height={24}
        alt="save"
      />
    </div>
  );
}
