
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
      className="flex h-[72px] w-[72px] bg-blur12 rounded-[20px] sm:h-[60px] sm:w-[60px] sm:rounded-xl flex-shrink-0 flex-grow-0 cursor-pointer snap-end items-center justify-center bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] data-[active=true]:bg-[rgba(255, 255, 255, 0.4)] data-[active=true]:border data-[active=true]:border-[rgba(255,255,255,0.2)]  data-[disabled=true]:cursor-not-allowed  data-[disabled=true]:opacity-50 "
    >
      {src && <Image src={src} width={40} height={40} alt={name} />}
    </div>
  );
}

