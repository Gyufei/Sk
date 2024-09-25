import Image from "next/image";

export function ConnectBtn({
  onClick,
  disabled,
  isSign,
  isConnect,
}: {
  onClick: () => void;
  disabled: boolean;
  isSign: boolean;
  isConnect: boolean;
}) {
  return (
    <div
      onClick={onClick}
      data-disabled={disabled}
      className="data- ml-0 mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 md:ml-4 md:mt-0 md:w-[200px]"
    >
      {isConnect && isSign && (
        <>
          <Image src="/icons/unlink.svg" width={24} height={24} alt="save" />
          <div className="ml-1 text-base leading-6">Disconnect</div>
        </>
      )}
      {!isConnect && isSign && (
        <>
          <Image src="/icons/linked.svg" width={24} height={24} alt="save" />
          <div className="ml-1 text-base leading-6">Connected</div>
        </>
      )}
      {!isSign && (
        <>
          <Image src="/icons/link.svg" width={24} height={24} alt="save" />
          <div className="ml-1 text-base leading-6">Connect</div>
        </>
      )}
    </div>
  );
}
