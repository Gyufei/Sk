import Image from "next/image";

export function IconItem({
  defaulImage = "/icons/save.svg",
  hoverImage = "/icons/save-black.svg",
  btnText = undefined,
  mobileHoverColorChanged = true,
}: {
  defaulImage?: string;
  hoverImage?: string;
  btnText?: string;
  mobileHoverColorChanged?: boolean;
}){
  const hidden = "left-[-24px] bottom-[-24px]";
  const block = "left-0 bottom-0";
  return (
    <div className="relative w-[24px] h-[24px] overflow-hidden">
      <Image
        className={`absolute ${block} ${mobileHoverColorChanged ? `group-[.isnot-disabled]:group-hover:left-[-24px] group-[.isnot-disabled]:group-hover:bottom-[-24px]` : `md:group-[.isnot-disabled]:group-hover:left-[-24px] md:group-[.isnot-disabled]:group-hover:bottom-[-24px]`}`}
        src={defaulImage}
        width={24}
        height={24}
        alt={btnText || 'save'}
      />
      <Image
         className={`absolute ${hidden} ${mobileHoverColorChanged ? `group-[.isnot-disabled]:group-hover:left-0 group-[.isnot-disabled]:group-hover:bottom-0`: `md:group-[.isnot-disabled]:group-hover:left-0 md:group-[.isnot-disabled]:group-hover:bottom-0`}`}
        src={hoverImage}
        width={24}
        height={24}
        alt={btnText || 'save'}
      />

    </div>
  )
}

export function IconBtn({
  disabled = false,
  mobileHoverColorChanged = true,
  handleClick,
  className = "",
  defaulImage = "/icons/save.svg",
  hoverImage = "/icons/save-black.svg",
  btnText = undefined,
  isConnected = false
}: {
  disabled?: boolean;
  mobileHoverColorChanged?: boolean;
  handleClick: () => void;
  className?: string;
  defaulImage?: string;
  hoverImage?: string;
  btnText?: string;
  isConnected?: boolean;
}) {

  return (
    <div
      data-disabled={disabled ? true : false}
      data-connected={isConnected ? true : false}
      data-notconnected={!isConnected}
      onClick={() => {
        if (disabled) return;
        handleClick()
      }}
      className={`group ${disabled ? 'is-disabled' : 'isnot-disabled'} w-12 ml-0 flex h-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 ${mobileHoverColorChanged ? 'data-[disabled=false]:hover:bg-[#fff] data-[disabled=false]:hover:text-[#000]' : 'md:data-[disabled=false]:hover:bg-[#fff]'} md:ml-4 md:mt-0 md:w-12 ${className}`}
    >
      <IconItem 
        defaulImage={defaulImage}
        hoverImage={hoverImage}
        btnText={btnText}
        mobileHoverColorChanged={mobileHoverColorChanged}
      />
      {btnText && (<div className="ml-1 text-base leading-6 md:hidden">{btnText}</div>)}
    </div>
  );
}
