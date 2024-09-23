import Image from "next/image";
import { InputWithClear } from "@/components/input-with-clear";
import { useLang } from "@/lib/use-lang";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { useState } from "react";
import { InvalidTpl } from "../info/invalid-tpl";

export const countryCodeList = ["86"];

export function NameAndPhone({
  recipientName,
  setRecipientName,
  countryCode,
  setCountryCode,
  phoneNumber,
  setPhoneNumber,
  rcNameValid,
  setRcNameValid,
  phoneValid,
  setPhoneValid,
}: {
  recipientName: string;
  setRecipientName: (v: string) => void;
  countryCode: string;
  setCountryCode: (v: string) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  rcNameValid: boolean;
  phoneValid: boolean;
  setRcNameValid: (v: boolean) => void;
  setPhoneValid: (v: boolean) => void;
}) {
  const { isEn } = useLang();

  const [countryCodeOpen, setCountryCodeOpen] = useState(false);

  function handleNameChange(v: string) {
    const newV = v.replace(/(^\s*)|(\s*$)/g, "");
    setRecipientName(newV);

    if (checkNameRegex(newV)) {
      setRcNameValid(true);
    }
  }

  function handlePhoneNumChange(v: string) {
    const newV = v.replace(/(^\s*)|(\s*$)/g, "");
    setPhoneNumber(newV);

    if (checkPhoneRegex(newV)) {
      setPhoneValid(true);
    }
  }

  function handleCountryCodeChange(v: string) {
    setCountryCode(v);
  }

  function handleNameBlur() {
    if (!recipientName) return true;

    setRcNameValid(checkNameRegex(recipientName));
  }

  function checkNameRegex(v: string) {
    const rcRegex = /^.{1,20}$/g;
    return rcRegex.test(v);
  }

  function handlePhoneBlur() {
    if (!phoneNumber) return true;

    setPhoneValid(checkPhoneRegex(phoneNumber));
  }

  function checkPhoneRegex(v: string) {
    const phoneRegex = /^\d{6,15}$/;
    return phoneRegex.test(v);
  }

  return (
    <div className="flex flex-col items-stretch space-x-0 space-y-5 md:flex-row md:items-center md:space-x-6 md:space-y-0">
      <div className="flex flex-1 flex-col">
        <label
          htmlFor="recipientName"
          className="text-lg font-normal leading-7 text-white opacity-60"
        >
          {isEn ? "Recipient Name" : "收货人"}
        </label>
        <InputWithClear
          isError={!rcNameValid}
          value={recipientName}
          onValueChange={(v) => handleNameChange(v)}
          isSign={false}
          inputId="recipientName"
          onBlur={handleNameBlur}
        />
        <InvalidTpl isValid={rcNameValid} />
      </div>

      <div className="flex flex-1 flex-col">
        <label
          htmlFor="phone"
          className="text-lg font-normal leading-7 text-white opacity-60"
        >
          {isEn ? "Phone" : "电话"}
        </label>
        <div className="flex">
          <Popover
            open={countryCodeOpen}
            onOpenChange={(isOpen) => setCountryCodeOpen(isOpen)}
          >
            <PopoverTrigger asChild>
              <div
                onClick={() => setCountryCodeOpen(!countryCodeOpen)}
                className="flex h-12 w-[80px] items-center justify-between border-b border-solid border-[#515151]"
              >
                <div className="flex items-center">
                  <div className="text-sm leading-6 text-[#d6d6d6]">
                    {countryCode && "+"}
                    {countryCode}
                  </div>
                </div>
                <Image
                  data-open={countryCodeOpen}
                  src="/icons/arrow-down.svg"
                  width={24}
                  height={24}
                  alt="down"
                  className="mr-2 data-[open=true]:rotate-180"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="no-scroll-bar flex w-[80px]  flex-col items-stretch space-y-2 overflow-y-auto border-none bg-[#262626] p-4">
              {countryCodeList.map((s) => (
                <div
                  key={s}
                  className="flex h-8 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] text-sm hover:brightness-75"
                  onClick={() => {
                    handleCountryCodeChange(s);
                    setCountryCodeOpen(false);
                  }}
                >
                  <div className="ml-3 leading-6 text-[#d6d6d6]">+{s}</div>
                </div>
              ))}
            </PopoverContent>
          </Popover>
          <InputWithClear
            isError={!phoneValid}
            value={phoneNumber}
            onValueChange={(v) => handlePhoneNumChange(v)}
            isSign={false}
            inputId="phone"
            conClass="w-full md:w-auto"
            onBlur={handlePhoneBlur}
          />
        </div>
        <InvalidTpl isValid={phoneValid} />
      </div>
    </div>
  );
}
