
import Image from "next/image";

export function ChainLogoText({ logo, name }: { logo: string; name: string }) {
  return (
    <>
      <Image
        src={logo}
        width={16}
        height={16}
        alt="sol net"
        className="ml-2 mr-1"
      />
      <div className="text-base leading-6">{name}</div>
    </>
  );
}