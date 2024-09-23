import Image from "next/image";
import { PcData } from "@/lib/pc";
import { useLang } from "@/lib/use-lang";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useState, useMemo } from "react";

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
