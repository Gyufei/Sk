"use client";

import { useEffect, useMemo, useState } from "react";
import { InputWithClear } from "./input-with-clear";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { PcData } from "@/lib/pc";
import { UserInfoAtom, UuidAtom } from "@/lib/state";
import { useAtomValue } from "jotai/react";
import fetcher from "@/lib/fetcher";
import { ApiHost } from "@/lib/path";
import { useLang } from "@/lib/use-lang";
import { useFetchUserInfo } from "@/lib/use-fetch-user-info";
import { cn } from "@/lib/utils";

const countryCodeList = ["86"];

export default function ShippingAddressPage() {
  const uuid = useAtomValue(UuidAtom);
  const userInfo = useAtomValue(UserInfoAtom);
  const { isEn } = useLang();
  const { getUserInfo } = useFetchUserInfo();

  const [recipientName, setRecipientName] = useState(
    userInfo?.shipping?.recipient_name || "",
  );

  const [country, setCountry] = useState(userInfo?.shipping?.country || "中国");
  const [state, setState] = useState(userInfo?.shipping?.state || "");
  const [city, setCity] = useState(userInfo?.shipping?.city || "");

  const [street, setStreet] = useState(userInfo?.shipping?.address_line || "");
  const [code, setCode] = useState(userInfo?.shipping?.zip_code || "");

  const [countryCode, setCountryCode] = useState(
    userInfo?.shipping?.country_code || 86,
  );
  const [phoneNumber, setPhoneNumber] = useState(
    userInfo?.shipping?.phone || "",
  );

  const [saved, setSaved] = useState(false);

  const [rcNameValid, setRcNameValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const [streetValid, setStreetValid] = useState(true);

  const disabled = useMemo(() => {
    if (saved) return true;
    if (!rcNameValid) return true;
    if (!streetValid) return true;
    if (!phoneValid) return true;
    if (!recipientName && !phoneNumber && !street && !code) return true;
    return false;
  }, [
    saved,
    recipientName,
    streetValid,
    phoneValid,
    street,
    rcNameValid,
    phoneNumber,
    code,
  ]);

  useEffect(() => {
    if (userInfo?.shipping) {
      setRecipientName(userInfo?.shipping?.recipient_name || "");
      setCountry(userInfo?.shipping?.country || "中国");
      setState(userInfo?.shipping?.state || "");
      setCity(userInfo?.shipping?.city || "");
      setStreet(userInfo?.shipping?.address_line || "");
      setCode(userInfo?.shipping?.zip_code || "");

      if (userInfo?.shipping?.phone) {
        let sWith = false;
        const ph = userInfo?.shipping?.phone;
        for (const pf of countryCodeList) {
          if (ph.startsWith(pf)) {
            setCountryCode(pf);
            setPhoneNumber(ph.slice(pf.length));
            sWith = true;
          }
        }

        if (!sWith) {
          const cC = userInfo?.shipping?.country_code || "86";
          setCountryCode(cC);
          setPhoneNumber(userInfo?.shipping?.phone);
        }
      } else {
        setCountryCode("86");
        setPhoneNumber("");
      }
    }
  }, [userInfo]);

  function handleSave() {
    if (!uuid || disabled) return;

    saveShip();
    getUserInfo();
  }

  async function saveShip() {
    if (!uuid) return;

    const res: any = await fetcher(`${ApiHost}/user/shipping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        recipient_name: recipientName,
        country_code: countryCode,
        phone: phoneNumber,
        country: country,
        state: state,
        city: city,
        address_line: street,
        zip_code: code,
      }),
    });

    if (res.status) {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    }

    return res;
  }

  return (
    <>
      <div className="mt-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur md:rounded-[18px] md:p-[20px]">
        <div className="mb-7 text-xl leading-[30px] text-white">
          {isEn ? "Shipping Address" : "收货地址"}
        </div>
        <NameAndPhone
          {...{
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
          }}
        />
        <Address {...{ country, setCountry, state, setState, city, setCity }} />
        <StreetAndCode
          {...{ street, setStreet, code, setCode, streetValid, setStreetValid }}
        >
          <SaveBtn
            className="hidden w-12 md:flex"
            disabled={disabled}
            onClick={handleSave}
          />
        </StreetAndCode>
      </div>
      <SaveBtn
        className="my-4 flex w-full bg-[rgba(255,255,255,0.1)] backdrop-blur md:hidden"
        disabled={disabled}
        onClick={handleSave}
      />
    </>
  );
}

function SaveBtn({
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

function NameAndPhone({
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
        <InvalidTip isValid={rcNameValid} />
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
        <InvalidTip isValid={phoneValid} />
      </div>
    </div>
  );
}

function Address({
  country,
  setCountry,
  state,
  setState,
  city,
  setCity,
}: {
  country: string;
  setCountry: (v: string) => void;
  state: string;
  setState: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
}) {
  const { isEn } = useLang();
  const [countryPopOpen, setCountryPopOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const countryArr = ["中国"];
  const stateArr = Object.keys(PcData);
  const cityArr: any[] = useMemo(() => {
    if (state) {
      return (PcData as any)[state];
    } else {
      return [];
    }
  }, [state]);

  function handleSateChange(s: string) {
    if (s === state) return;
    setState(s);
    setCity("");
  }

  return (
    <div className="mt-4 flex flex-col items-stretch space-x-0 space-y-5 md:mt-10 md:flex-row md:items-center md:space-x-6 md:space-y-0">
      <div className="flex flex-1 flex-col">
        <div className="text-lg font-normal leading-7 text-white opacity-60">
          {isEn ? "Country" : "国家"}
        </div>
        <Popover
          open={countryPopOpen}
          onOpenChange={(isOpen) => setCountryPopOpen(isOpen)}
        >
          <PopoverTrigger asChild>
            <div
              onClick={() => setCountryPopOpen(!countryPopOpen)}
              className="flex h-12 w-full items-center justify-between border-b border-solid border-[#515151] md:w-[200px]"
            >
              <div className="flex items-center text-sm">
                <div className="leading-6 text-[#d6d6d6]">{country}</div>
              </div>
              <Image
                data-open={countryPopOpen}
                src="/icons/arrow-down.svg"
                width={24}
                height={24}
                alt="down"
                className="data-[open=true]:rotate-180"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="no-scroll-bar flex w-[200px] flex-col items-stretch space-y-2 overflow-y-auto border-none bg-[#262626] p-4">
            {countryArr.map((c) => (
              <div
                key={c}
                className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] text-sm hover:brightness-75"
                onClick={() => {
                  setCountry(c);
                  setCountryPopOpen(false);
                }}
              >
                <div className="ml-3 leading-6 text-[#d6d6d6]">{c}</div>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="text-sm font-normal leading-7 text-white opacity-60">
          {isEn ? "State" : "省"}
        </div>
        <Popover
          open={stateOpen}
          onOpenChange={(isOpen) => setStateOpen(isOpen)}
        >
          <PopoverTrigger asChild>
            <div
              onClick={() => setStateOpen(!countryPopOpen)}
              className="flex h-12 w-full items-center justify-between border-b border-solid border-[#515151] md:w-[200px]"
            >
              <div className="flex items-center">
                <div className="text-sm leading-6 text-[#d6d6d6]">{state}</div>
              </div>
              <Image
                data-open={stateOpen}
                src="/icons/arrow-down.svg"
                width={24}
                height={24}
                alt="down"
                className="data-[open=true]:rotate-180"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="no-scroll-bar flex h-[300px] w-[200px]  flex-col items-stretch space-y-2 overflow-y-auto border-none bg-[#262626] p-4">
            {stateArr.map((s) => (
              <div
                key={s}
                className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] hover:brightness-75"
                onClick={() => {
                  handleSateChange(s);
                  setStateOpen(false);
                }}
              >
                <div className="ml-3 text-sm leading-6 text-[#d6d6d6]">{s}</div>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="text-sm font-normal leading-7 text-white opacity-60">
          {isEn ? "City" : "市"}
        </div>
        <Popover open={cityOpen} onOpenChange={(isOpen) => setCityOpen(isOpen)}>
          <PopoverTrigger asChild>
            <div
              onClick={() => setCityOpen(!countryPopOpen)}
              className="flex h-12 w-full items-center justify-between border-b border-solid border-[#515151] md:w-[200px]"
            >
              <div className="flex items-center">
                <div className="text-sm leading-6 text-[#d6d6d6]">{city}</div>
              </div>
              <Image
                data-open={cityOpen}
                src="/icons/arrow-down.svg"
                width={24}
                height={24}
                alt="down"
                className="data-[open=true]:rotate-180"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="no-scroll-bar flex h-[300px] w-[200px]  flex-col items-stretch space-y-2 overflow-y-auto border-none bg-[#262626] p-4">
            {cityArr.map((c) => (
              <div
                key={c}
                className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] hover:brightness-75"
                onClick={() => {
                  setCity(c);
                  setCityOpen(false);
                }}
              >
                <div className="ml-3 text-sm leading-6 text-[#d6d6d6]">{c}</div>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function StreetAndCode({
  street,
  setStreet,
  code,
  setCode,
  streetValid,
  setStreetValid,
  children,
}: {
  street: string;
  setStreet: (v: string) => void;
  code: string;
  setCode: (v: string) => void;
  streetValid: boolean;
  setStreetValid: (v: boolean) => void;
  children: React.ReactNode;
}) {
  const { isEn } = useLang();

  function handleStreetChange(v: string) {
    const newV = v.replace(/(^\s*)|(\s*$)/g, "");
    setStreet(newV);

    if (checkStreetRegex(newV)) {
      setStreetValid(true);
    }
  }

  function handleStreetBlur() {
    if (!street) return true;

    setStreetValid(checkStreetRegex(street));
  }

  function checkStreetRegex(v: string) {
    const streetRegex =
      // eslint-disable-next-line no-useless-escape
      /^.{6,100}$/g;

    return streetRegex.test(v);
  }

  return (
    <div className="relative mt-4 flex flex-col items-stretch space-x-0 space-y-5 md:mt-10 md:flex-row md:items-center md:space-x-6 md:space-y-0">
      <div className="flex flex-1 flex-col">
        <label
          htmlFor="street"
          className="text-lg font-normal leading-7 text-white opacity-60"
        >
          {isEn ? "Address line / Street" : "详细地址 / 街道"}
        </label>
        <InputWithClear
          isError={!streetValid}
          value={street}
          onValueChange={(v) => handleStreetChange(v)}
          isSign={false}
          inputId="street"
          onBlur={handleStreetBlur}
        />
        <InvalidTip isValid={streetValid} />
      </div>

      <div className="flex flex-1 flex-col pb-6">
        <label
          htmlFor="code"
          className="text-lg font-normal leading-7 text-white opacity-60"
        >
          {isEn ? "Zip Code" : "邮编"}
        </label>
        <InputWithClear
          isError={false}
          value={code}
          onValueChange={(v) => setCode(v)}
          isSign={false}
          inputId="code"
        />
      </div>

      {children}
    </div>
  );
}

function InvalidTip({ isValid }: { isValid: boolean }) {
  const { isEn } = useLang();

  return (
    <div className="mt-2 h-4 text-sm leading-5 text-[#FF5A5A]">
      {isValid ? null : isEn ? "invalid format" : "格式错误"}
    </div>
  );
}