import Image from "next/image";
import { useState } from "react";

export function SaveBtn({
  disabled,
  handleSave,
  className = "",
}: {
  disabled: boolean;
  handleSave: () => void;
  className?: string;
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      data-disabled={disabled}
      onClick={handleSave}
      className={`ml-0 mt-[10px] flex h-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=false]:hover:bg-[#fff] md:ml-4  md:mt-0 md:w-12 ${className}`}
    >
      <Image
        src={isHover && !disabled ? "/icons/save-black.svg" : "/icons/save.svg"}
        width={24}
        height={24}
        alt="save"
      />
      <div className="ml-1 text-base leading-6 md:hidden">Save</div>
    </div>
  );
}
