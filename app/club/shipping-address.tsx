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

const prefixArr = ["+86"];

export function ShippingAddress() {
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

  const [prefix, setPrefix] = useState(userInfo?.shipping?.country_code);
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.shipping?.phone);

  const [saved, setSaved] = useState(false);

  const rcNameValid = useMemo(() => {
    if (!recipientName) return true;

    const rcRegex = /^[\u4E00-\u9FFF]{2,}$|^[a-zA-Z\s]{2,}$/;

    return rcRegex.test(recipientName);
  }, [recipientName]);

  const streetValid = useMemo(() => {
    if (!street) return true;

    const streetRegex = /^[\u4E00-\u9FFFa-zA-Z\s]{4,}$/g;

    return streetRegex.test(street);
  }, [street]);

  const phoneValid = useMemo(() => {
    if (!phoneNumber) return true;

    const phoneRegex = /^\d{9,12}$/;

    return phoneRegex.test(phoneNumber);
  }, [phoneNumber]);

  const disabled = useMemo(() => {
    if (!rcNameValid) return true;
    if (!streetValid) return true;
    if (!phoneValid) return true;
    if (!recipientName && !phoneNumber && !street && !code) return true;
    return false;
  }, [
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
        for (const pf of prefixArr) {
          if (ph.startsWith(pf)) {
            setPrefix(pf);
            setPhoneNumber(ph.slice(pf.length));
            sWith = true;
          }
        }

        if (!sWith) {
          setPrefix(userInfo?.shipping?.country_code || "+86");
          setPhoneNumber(userInfo?.shipping?.phone);
        }
      } else {
        setPrefix("+86");
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
        country_code: prefix,
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
      }, 5000);
    }

    return res;
  }

  return (
    <div className="mt-12">
      <div className="mb-7 text-xl leading-[30px] text-white">
        {isEn ? "Shipping Address" : "收货地址"}
      </div>
      <NameAndPhone
        {...{
          recipientName,
          setRecipientName,
          prefix,
          setPrefix,
          phoneNumber,
          setPhoneNumber,
          rcNameValid,
          phoneValid,
        }}
      />
      <Address {...{ country, setCountry, state, setState, city, setCity }} />
      <StreetAndCode {...{ street, setStreet, code, setCode, streetValid }} />

      <div className="mt-10 flex items-center justify-end">
        {saved && <div className="mr-6">{isEn ? "Saved" : "已保存"}</div>}
        <div
          onClick={handleSave}
          data-disabled={disabled}
          className="flex h-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] px-[100px]   text-[rgba(255,255,255,0.6)] hover:border-[rgba(255,255,255,0.8)] hover:text-[rgba(255,255,255,0.8)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
        >
          {isEn ? "Save" : "保存"}
        </div>
      </div>
    </div>
  );
}

function NameAndPhone({
  recipientName,
  setRecipientName,
  prefix,
  setPrefix,
  phoneNumber,
  setPhoneNumber,
  rcNameValid,
  phoneValid,
}: {
  recipientName: string;
  setRecipientName: (v: string) => void;
  prefix: string;
  setPrefix: (v: string) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  rcNameValid: boolean;
  phoneValid: boolean;
}) {
  const { isEn } = useLang();

  const [prefixOpen, setPrefixOpen] = useState(false);

  function handleNameChange(v: string) {
    const newV = v.replace(/\s+/g, " ");
    setRecipientName(newV);
  }

  function handlePhoneNumChange(v: string) {
    const newV = v.replace(/\s+/g, "");
    setPhoneNumber(newV);
  }

  function handlePrefixChange(v: string) {
    setPrefix(v);
  }

  return (
    <div className="flex items-center space-x-6">
      <div className="flex flex-1 flex-col">
        <label
          htmlFor="recipientName"
          className="text-lg font-normal leading-7 text-white opacity-60"
        >
          {isEn ? "Recipient Name" : "收货人"}
        </label>
        <InputWithClear
          isError={false}
          value={recipientName}
          onValueChange={(v) => handleNameChange(v)}
          isSign={false}
          inputId="recipientName"
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
            open={prefixOpen}
            onOpenChange={(isOpen) => setPrefixOpen(isOpen)}
          >
            <PopoverTrigger asChild>
              <div
                onClick={() => setPrefixOpen(!prefixOpen)}
                className="flex h-12 w-[80px] items-center justify-between border-b border-solid border-[#515151]"
              >
                <div className="flex items-center">
                  <div className="text-sm leading-6 text-[#d6d6d6]">
                    {prefix}
                  </div>
                </div>
                <Image
                  data-open={prefixOpen}
                  src="./icons/arrow-down.svg"
                  width={24}
                  height={24}
                  alt="down"
                  className="mr-2 data-[open=true]:rotate-180"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="no-scroll-bar flex w-[80px]  flex-col items-stretch space-y-2 overflow-y-auto border-none bg-[#262626] p-4">
              {prefixArr.map((s) => (
                <div
                  key={s}
                  className="flex h-8 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] text-sm hover:brightness-75"
                  onClick={() => {
                    handlePrefixChange(s);
                    setPrefixOpen(false);
                  }}
                >
                  <div className="ml-3 leading-6 text-[#d6d6d6]">{s}</div>
                </div>
              ))}
            </PopoverContent>
          </Popover>
          <InputWithClear
            isError={false}
            value={phoneNumber}
            onValueChange={(v) => handlePhoneNumChange(v)}
            isSign={false}
            inputId="phone"
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
    <div className="mt-10 flex items-center space-x-6">
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
              className="flex h-12 w-[200px] items-center justify-between border-b border-solid border-[#515151]"
            >
              <div className="flex items-center">
                <div className="leading-6 text-[#d6d6d6]">{country}</div>
              </div>
              <Image
                data-open={countryPopOpen}
                src="./icons/arrow-down.svg"
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
                className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] hover:brightness-75"
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
        <div className="text-lg font-normal leading-7 text-white opacity-60">
          {isEn ? "State" : "省"}
        </div>
        <Popover
          open={stateOpen}
          onOpenChange={(isOpen) => setStateOpen(isOpen)}
        >
          <PopoverTrigger asChild>
            <div
              onClick={() => setStateOpen(!countryPopOpen)}
              className="flex h-12 w-[200px] items-center justify-between border-b border-solid border-[#515151]"
            >
              <div className="flex items-center">
                <div className="leading-6 text-[#d6d6d6]">{state}</div>
              </div>
              <Image
                data-open={stateOpen}
                src="./icons/arrow-down.svg"
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
                <div className="ml-3 leading-6 text-[#d6d6d6]">{s}</div>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="text-lg font-normal leading-7 text-white opacity-60">
          {isEn ? "City" : "市"}
        </div>
        <Popover open={cityOpen} onOpenChange={(isOpen) => setCityOpen(isOpen)}>
          <PopoverTrigger asChild>
            <div
              onClick={() => setCityOpen(!countryPopOpen)}
              className="flex h-12 w-[200px] items-center justify-between border-b border-solid border-[#515151]"
            >
              <div className="flex items-center">
                <div className="leading-6 text-[#d6d6d6]">{city}</div>
              </div>
              <Image
                data-open={cityOpen}
                src="./icons/arrow-down.svg"
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
                <div className="ml-3 leading-6 text-[#d6d6d6]">{c}</div>
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
}: {
  street: string;
  setStreet: (v: string) => void;
  code: string;
  setCode: (v: string) => void;
  streetValid: boolean;
}) {
  const { isEn } = useLang();
  return (
    <div className="mt-10 flex items-center space-x-6">
      <div className="flex flex-1 flex-col">
        <label
          htmlFor="street"
          className="text-lg font-normal leading-7 text-white opacity-60"
        >
          {isEn ? "Address line / Street" : "详细地址 / 街道"}
        </label>
        <InputWithClear
          isError={false}
          value={street}
          onValueChange={(v) => setStreet(v)}
          isSign={false}
          inputId="street"
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
