import Image from "next/image";
import { InputWithClear } from "@/components/input-with-clear";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { InvalidTpl } from "@/components/invalid-tpl";
import { PopDrawer } from "@/components/pop-drawer";

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
  code,
  setCode,
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
  code: string;
  setCode: (v: string) => void;
}) {
  const T = useTranslations("Common");

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

  const titleClass = "font-haasDisp text-lg font-medium leading-7 text-white opacity-60";

  return (
    <div className="flex flex-col items-stretch space-x-0 space-y-[30px] sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0">
      <div className="flex w-full flex-col sm:w-[237px]">
        <label
          htmlFor="recipientName"
          className={titleClass}
        >
          {T("RecipientName")}
        </label>
        <InputWithClear
          isError={!rcNameValid}
          value={recipientName}
          onValueChange={(v) => handleNameChange(v)}
          isSign={false}
          inputId="recipientName"
          inputClass="text-base"
          onBlur={handleNameBlur}
        />
        <InvalidTpl isValid={rcNameValid} />
      </div>

      <div className="flex w-full flex-col sm:w-[349px]">
        <label
          htmlFor="phone"
          className={titleClass}
        >
          {T("Phone")}
        </label>
        <div className="flex items-end">
          <PopDrawer
            title={T("Phone")}
            className={"h-[400px]"}
            open={countryCodeOpen}
            onOpenChange={(isOpen) => setCountryCodeOpen(isOpen)}
            popContentClass={'w-[80px]'}
            popContent={countryCodeList.map((s) => (
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
          >
            <div
              onClick={() => setCountryCodeOpen(!countryCodeOpen)}
              className="flex h-12 w-[80px] items-center justify-between border-b border-solid border-[#515151]"
            >
              <div className="flex items-center">
                <div className="text-base font-medium leading-6 text-[#d6d6d6]">
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
          </PopDrawer>
          <InputWithClear
            isError={!phoneValid}
            value={phoneNumber}
            onValueChange={(v) => handlePhoneNumChange(v)}
            isSign={false}
            inputId="phone"
            conClass="w-full"
            inputClass="text-base"
            onBlur={handlePhoneBlur}
          />
        </div>
        <InvalidTpl isValid={phoneValid} />
      </div>

      <div className="flex w-full flex-col sm:w-[120px]">
        <label
          htmlFor="code"
          className={titleClass}
        >
          {T("ZipCode")}
        </label>
        <InputWithClear
          isError={false}
          value={code}
          onValueChange={(v) => setCode(v)}
          isSign={false}
          inputId="code"
          inputClass="text-base"
        />
      </div>
    </div>
  );
}
