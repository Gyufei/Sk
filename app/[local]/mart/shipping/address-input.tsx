import Image from "next/image";
import { PcData } from "@/lib/const/pc";
import { useTranslations } from "next-intl";

import { useState, useMemo } from "react";
import { PopDrawer } from "@/components/pop-drawer";

export function AddressInput({
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
  const T = useTranslations("Common");
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

  const titleClass = "font-haasDisp text-lg font-medium leading-7 text-white opacity-60";
  return (
    <div className="mt-[30px] flex flex-col items-stretch space-x-0 space-y-[30px] sm:mt-10 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0">
      <div className="flex flex-1 flex-col sm:mt-0">
        <div className={titleClass}>
          {T("Country")}
        </div>
        <PopDrawer
          title={T("Country")}
          className={"h-[400px]"}
          open={countryPopOpen}
          onOpenChange={(isOpen) => setCountryPopOpen(isOpen)}
          popContent={countryArr.map((c) => (
            <div
              key={c}
              className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] hover:brightness-75"
              onClick={() => {
                setCountry(c);
                setCountryPopOpen(false);
              }}
            >
              <div className="ml-3 text-base sm:text-sm leading-6 text-[#d6d6d6]">{c}</div>
            </div>
          ))}
        >
          <div
            onClick={() => setCountryPopOpen(!countryPopOpen)}
            className="flex h-12 w-full items-center justify-between border-b border-solid border-[#515151]"
          >
            <div className="flex items-center text-base">
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
        </PopDrawer>
      </div>
      <div className="flex flex-1 flex-col">
        <div className={titleClass}>
          {T("State")}
        </div>
        <PopDrawer
          title= {T("State")}
          open={stateOpen}
          onOpenChange={(isOpen) => setStateOpen(isOpen)}
          popContentClass={'h-[200px]'}
          popContent={stateArr.map((s) => (
            <div
              key={s}
              className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] hover:brightness-75"
              onClick={() => {
                handleSateChange(s);
                setStateOpen(false);
              }}
            >
              <div className="ml-3 text-base sm:text-sm leading-6 text-[#d6d6d6]">{s}</div>
            </div>
          ))}
        >
          <div
            onClick={() => setStateOpen(!countryPopOpen)}
            className="flex h-12 w-full items-center justify-between border-b border-solid border-[#515151]"
          >
            <div className="flex items-center">
              <div className="text-base leading-6 text-[#d6d6d6]">{state}</div>
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
        </PopDrawer>
      </div>
      <div className="flex flex-1 flex-col">
        <div className={titleClass}>
          {T("City")}
        </div>
        <PopDrawer
          title={T("City")}
          open={cityOpen} 
          onOpenChange={(isOpen) => setCityOpen(isOpen)}
          popContentClass={'h-[200px]'}
          popContent={cityArr.map((c) => (
            <div
              key={c}
              className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] hover:brightness-75"
              onClick={() => {
                setCity(c);
                setCityOpen(false);
              }}
            >
              <div className="ml-3 text-base sm:text-sm leading-6 text-[#d6d6d6]">{c}</div>
            </div>
          ))}
        >
          <div
            onClick={() => setCityOpen(!countryPopOpen)}
            className="flex h-12 w-full items-center justify-between border-b border-solid border-[#515151]"
          >
            <div className="flex items-center">
              <div className="text-base leading-6 text-[#d6d6d6]">{city}</div>
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
        </PopDrawer>
      </div>
    </div>
  );
}
