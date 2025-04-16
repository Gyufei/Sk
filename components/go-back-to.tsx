import Image from "next/image";
import { usePathname, useRouter } from "@/app/navigation";

export function GoBackTo() {
  const pathname = usePathname();
  const router = useRouter();

  function handleBack() {
    if (pathname.includes("/dashboard")) {
      router.push("/dashboard");
      return;
    }
    window.history.back();
  }

  return (
    <div
      className="flex h-[50px] w-[50px] items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.1)] backdrop-blur-md sm:-left-[84px] sm:top-[4px] sm:h-[60px] sm:w-[60px]"
      onClick={handleBack}
    >
      <Image
        className="cursor-pointer"
        src="/icons/close-no-circle.svg"
        width={30}
        height={30}
        alt="back"
      />
    </div>
  );
}
