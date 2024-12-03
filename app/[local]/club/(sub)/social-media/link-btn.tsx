import { IconBtn } from "@/components/icon-btn";

export function LinkBtn({
  onClick,
  disabled,
  isConnected,
}: {
  onClick: () => void;
  disabled: boolean;
  isConnected: boolean;
}) {
  const connectedClassHover = "data-[connected=true]:data-[disabled=false]:hover:border-[#FF5A5A] data-[connected=true]:data-[disabled=false]:hover:bg-[#FF5A5A] data-[connected=true]:data-[disabled=false]:hover:text-white";
  const notConnectedClassHover = "data-[notconnected=true]:data-[disabled=false]:hover:border-[#FFF] data-[notconnected=true]:data-[disabled=false]:hover:bg-[#FFF] data-[notconnected=true]:data-[disabled=false]:hover:text-[#000]";

  return (
    <IconBtn
      disabled={disabled}
      isConnected={isConnected}
      handleClick={onClick}
      className={`w-full mt-[20px] ${connectedClassHover} ${notConnectedClassHover}`}
      defaulImage={isConnected ? "/icons/linked.svg" : "/icons/link.svg"}
      hoverImage={isConnected ? "/icons/unlink-white.svg" : "/icons/link-black.svg"}
      btnText={isConnected ? "Disconnect" : "Connect"}
    />
  );
}

