import Image from "next/image";

export function LinkBtn({
  onClick,
  disabled,
  isConnected,
}: {
  onClick: () => void;
  disabled: boolean;
  isConnected: boolean;
}) {

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  const connectedClassHover = "data-[connected=true]:data-[disabled=false]:hover:border-[#FF5A5A] data-[connected=true]:data-[disabled=false]:hover:bg-[#FF5A5A]";
  const notConnectedClassHover = "data-[notconnected=true]:data-[disabled=false]:hover:border-[#FFF] data-[notconnected=true]:data-[disabled=false]:hover:bg-[#FFF]";
  return (
    <div
      onClick={handleClick}
      data-disabled={disabled ? true : false}
      data-connected={isConnected ? true : false}
      data-notconnected={!isConnected}
      className={`group ${disabled ? 'is-disabled' : 'isnot-disabled'} ml-0 mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 ${connectedClassHover} ${notConnectedClassHover} md:ml-4 md:mt-0 md:w-12`}
    >
      <Image
        className={'inline-block md:group-[.isnot-disabled]:group-hover:hidden'}
        src={isConnected ? "/icons/linked.svg" : "/icons/link.svg"}
        width={24}
        height={24}
        alt="save"
      />
      <Image
        className={'hidden md:group-[.isnot-disabled]:group-hover:inline-block'}
        src={isConnected ? "/icons/unlink-white.svg" : "/icons/link-black.svg"}
        width={24}
        height={24}
        alt="save"
      />
      <div className="ml-1 text-base leading-6 md:hidden">
        {isConnected ? "Disconnect" : "Connect"}
      </div>
    </div>
  );
}
