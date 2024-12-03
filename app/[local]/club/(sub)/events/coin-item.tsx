
import Image from "next/image";

export function CoinItem({
  disabled,
  src,
  onClick,
  isActive,
  name,
}: {
  disabled: boolean;
  src: string;
  onClick: () => void;
  isActive: boolean;
  name: string;
}) {
  function handleClick() {
    if (disabled) return;
    if (src) onClick();
  }

  return (
    <div
      onClick={handleClick}
      data-disabled={disabled}
      data-active={isActive}
      className="flex h-[60px] w-[60px] flex-shrink-0 flex-grow-0 cursor-pointer snap-end items-center justify-center bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] data-[active=true]:h-[80px] data-[disabled=true]:cursor-not-allowed data-[active=false]:rounded-xl data-[active=true]:rounded-b-xl data-[disabled=true]:opacity-50 md:data-[active=true]:h-[60px] md:data-[active=true]:w-[80px] data-[active=true]:md:rounded-l-xl data-[active=true]:md:rounded-br-none"
    >
      {src && <Image src={src} width={40} height={40} alt={name} />}
    </div>
  );
}

