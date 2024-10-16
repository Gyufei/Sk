import { useState } from "react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";

export function InputWithClear({
  value,
  placeHolder,
  placeHolderText,
  onValueChange,
  isError = false,
  isSign = false,
  conClass,
  inputClass,
  iconClass,
  inputId,
  onBlur,
  readOnly = false,
  showClearButton = true,
}: {
  value: string;
  placeHolder?: string;
  placeHolderText?: string;
  onValueChange: (_v: string) => void;
  isError?: boolean;
  isSign: boolean;
  conClass?: string;
  inputClass?: string;
  iconClass?: string;
  inputId?: string;
  onBlur?: () => void;
  readOnly?: boolean;
  showClearButton?: boolean;
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

  function handleFocus() {
    if (!readOnly) {
      setIsFocus(true);
    }
  }

  return (
    <div
      data-error={isError}
      className={cn(
        "relative flex items-center border-b border-[rgba(255,255,255,0.2)] data-[error=true]:border-[#FF5A5A]",
        conClass,
      )}
    >
      {placeHolderText && (
        <div className="mr-3 text-base font-medium leading-6 text-[#d6d6d6]">
          {placeHolderText}
        </div>
      )}
      <Input
        id={inputId || ""}
        value={value}
        placeholder={placeHolder}
        onChange={(e: any) => onValueChange(e.target.value)}
        className={cn(
          "h-12 rounded-none border-none bg-transparent pl-0 pr-6 text-[#d6d6d6] ",
          inputClass,
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        readOnly={readOnly}
      />
      {showClearButton && isFocus && !readOnly && (
        <Image
          src="/icons/close.svg"
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
          src="/icons/sign.svg"
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
