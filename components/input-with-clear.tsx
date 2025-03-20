import { useState } from "react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";

export function InputWithClear({
  value,
  placeHolder,
  placeHolderText,
  type,
  onValueChange,
  isError = false,
  showLink = false,
  conClass,
  inputClass,
  iconClass,
  inputId,
  onBlur,
  readOnly = false,
  showUnLink = false,
  showClear = true,
}: {
  value: string;
  placeHolder?: string;
  placeHolderText?: string;
  inputId?: string;
  type?: string;
  readOnly?: boolean;
  onValueChange: (_v: string) => void;
  conClass?: string;
  inputClass?: string;
  iconClass?: string;

  isError?: boolean;
  showLink: boolean;
  onBlur?: () => void;
  showUnLink?: boolean;
  showClear?: boolean;
}) {
  const [isFocus, setIsFocus] = useState(false);

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
        "relative flex items-center border-b border-[#ffffff20] data-[error=true]:border-[#FF5A5A]",
        conClass,
      )}
    >
      {placeHolderText && (
        <div className="mr-3 text-base font-medium leading-6 text-[#d6d6d6]">
          {placeHolderText}
        </div>
      )}
      <Input
        id={inputId || placeHolder}
        value={value}
        type={type}
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
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 transform gap-2">
        {showClear && value && (
          <button
            onClick={($event) => {
              $event.preventDefault();
              $event.stopPropagation();
              onValueChange("");
            }}
          >
            <Image
              src="/icons/close.svg"
              width={20}
              height={20}
              alt="sign"
              className={cn(iconClass)}
            />
          </button>
        )}
        {showLink && !isFocus && (
          <Image
            src="/icons/sign.svg"
            width={20}
            height={20}
            alt="sign"
            className={cn(iconClass)}
          />
        )}
        {value && showUnLink && (
          <Image
            src="/icons/close-red.svg"
            width={20}
            height={20}
            alt="link"
            className={cn(iconClass)}
          />
        )}
      </div>
    </div>
  );
}
