import Image from "next/image";

export function GoBackTo() {
  function handleBack() {
    window.history.back();
  }

  return (
    <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.1)] backdrop-blur-md md:-left-[84px] md:top-[4px]">
      <Image
        onClick={handleBack}
        className="cursor-pointer"
        src="/icons/close-no-circle.svg"
        width={30}
        height={30}
        alt="back"
      />
    </div>
  );
}
