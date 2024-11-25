import Image from "next/image";

export function IconBtn({
  disabled = false,
  mobileHoverColorChanged = true,
  handleClick,
  className = "",
  defaulImage = "/icons/save.svg",
  hoverImage = "/icons/save-black.svg",
  btnText = undefined
}: {
  disabled?: boolean;
  mobileHoverColorChanged?: boolean;
  handleClick: () => void;
  className?: string;
  defaulImage?: string;
  hoverImage?: string;
  btnText?: string;
}) {

  return (
    <div
      data-disabled={disabled}
      onClick={() => {
        if (disabled) return;
        handleClick()
      }}
      className={`group ${disabled ? 'is-disabled' : 'isnot-disabled'} w-12 ml-0 flex h-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 ${mobileHoverColorChanged ? 'data-[disabled=false]:hover:bg-[#fff] data-[disabled=false]:hover:text-[#000]' : 'md:data-[disabled=false]:hover:bg-[#fff]'} md:ml-4 md:mt-0 md:w-12 ${className}`}
    >
      <Image
        className={`${mobileHoverColorChanged ? 'group-[.isnot-disabled]:group-hover:hidden' : 'inline-block md:group-[.isnot-disabled]:group-hover:hidden'}`}
        src={defaulImage}
        width={24}
        height={24}
        alt="save"
      />
      <Image
        className={`${mobileHoverColorChanged ? 'hidden group-[.isnot-disabled]:group-hover:inline-block' : 'hidden md:group-[.isnot-disabled]:group-hover:inline-block'}`}
        src={hoverImage}
        width={24}
        height={24}
        alt="save"
      />
      {btnText && (<div className="ml-1 text-base leading-6 md:hidden">{btnText}</div>)}
    </div>
  );
}
