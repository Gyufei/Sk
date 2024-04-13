import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function InputWithClear({
  value,
  placeHolder,
  onValueChange,
  isError = false,
  isSign = false,
  conClass,
  inputClass,
  iconClass,
  inputId,
  onBlur,
}: {
  value: string;
  placeHolder?: string;
  onValueChange: (_v: string) => void;
  isError?: boolean;
  isSign: boolean;
  conClass?: string;
  inputClass?: string;
  iconClass?: string;
  inputId?: string;
  onBlur?: () => void;
}) {
  const [isFocus, setIsFocus] = useState(false);

  function clearInput() {
    onValueChange("");
  }

  function handleBlur() {
    setIsFocus(false);

    if (onBlur) {
      onBlur();
    }
  }

  return (
    <div className={cn("relative ", conClass)}>
      <Input
        id={inputId || ""}
        data-error={isError}
        value={value}
        placeholder={placeHolder}
        onChange={(e: any) => onValueChange(e.target.value)}
        className={cn(
          "h-12 rounded-none border-b border-[rgba(255,255,255,0.2)] bg-transparent pl-0 text-[#d6d6d6] data-[error=true]:border-[#FF5A5A]",
          inputClass,
        )}
        onFocus={() => setIsFocus(true)}
        onBlur={() => handleBlur()}
      />
      {isFocus && (
        <Image
          src="./icons/close.svg"
          width={20}
          height={20}
          alt="sign"
          className={cn(
            "absolute right-0 top-[14px] cursor-pointer",
            iconClass,
          )}
          onMouseDown={($event) => {
            $event.preventDefault();
            $event.stopPropagation();
            clearInput();
          }}
        />
      )}
      {isSign && !isFocus && (
        <Image
          src="./icons/sign.svg"
          width={20}
          height={20}
          alt="sign"
          className={cn(
            "absolute right-0 top-[14px] cursor-pointer",
            iconClass,
          )}
        />
      )}
    </div>
  );
}
