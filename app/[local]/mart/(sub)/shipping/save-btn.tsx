import { cn } from "@/lib/utils/utils";
import Image from "next/image";

export function SaveBtn({
  disabled,
  onClick,
  className,
}: {
  disabled: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <div
      data-disabled={disabled}
      onClick={onClick}
      className={cn(
        className,
        "ml-0 h-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 md:ml-4",
      )}
    >
      <Image src="/icons/save.svg" width={24} height={24} alt="save" />
      <div className="ml-1 text-base leading-6 md:hidden">Save</div>
    </div>
  );
}
