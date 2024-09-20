import { useLang } from "@/lib/use-lang";
import { InvalidTpl } from "./social-media";
import { useState } from "react";
import { InputWithClear } from "@/components/input-with-clear";
import { checkEmailRegex } from "@/lib/utils";

export function Exchanges() {
  const { isEn } = useLang();

  const [bnUID, setBnUID] = useState("");
  const [bnUIDValid, setBnUIDValid] = useState(true);
  const [okxUID, setOKXUID] = useState("");
  const [okxUIDValid, setOKXUIDValid] = useState(true);
  const [byBitUID, setByBitUID] = useState("");
  const [byBitUIDValid, setByBitUIDValid] = useState(true);

  function handleBnBlur() {
    if (!bnUID) return true;

    const isNumRegex = checkUIdRegex(bnUID);
    const isEmailRegex = checkEmailRegex(bnUID);

    setBnUIDValid(isNumRegex || isEmailRegex);
  }

  function handleOkxBlur() {
    if (!okxUID) return true;

    const isNumRegex = checkUIdRegex(okxUID);
    const isEmailRegex = checkEmailRegex(okxUID);

    setOKXUIDValid(isNumRegex || isEmailRegex);
  }

  function handleByBitBlur() {
    if (!byBitUID) return true;

    const isNumRegex = checkUIdRegex(byBitUID);
    const isEmailRegex = checkEmailRegex(byBitUID);

    setByBitUIDValid(isNumRegex || isEmailRegex);
  }

  function checkUIdRegex(v: string) {
    const number = /^\d{6,15}$/;
    return number.test(v);
  }

  return (
    <div className="mt-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur md:rounded-[18px] md:p-[20px]">
      <div className="mb-5 text-xl leading-[30px] text-white">
        {isEn ? "Exchanges" : "交易所"}
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col items-start">
          <div className="flex w-[140px] items-center space-x-2">
            <div className="text-base leading-6 text-[#D6D6D6]">Binance</div>
          </div>
          <InputWithClear
            isError={!bnUIDValid}
            value={bnUID}
            onValueChange={(v) => setBnUID(v)}
            isSign={false}
            inputId="phone"
            conClass="w-full md:w-auto"
            onBlur={handleBnBlur}
            placeHolder="UID/Email"
          />
          <InvalidTpl isValid={bnUIDValid} />
        </div>
        <div className="flex flex-col items-start">
          <div className="flex w-[140px] items-center space-x-2">
            <div className="text-base leading-6 text-[#D6D6D6]">OKX</div>
          </div>
          <InputWithClear
            isError={!okxUIDValid}
            value={okxUID}
            onValueChange={(v) => setOKXUID(v)}
            isSign={false}
            inputId="phone"
            conClass="w-full md:w-auto"
            onBlur={handleOkxBlur}
            placeHolder="UID/Email"
          />
          <InvalidTpl isValid={okxUIDValid} />
        </div>
        <div className="flex flex-col items-start">
          <div className="flex w-[140px] items-center space-x-2">
            <div className="text-base leading-6 text-[#D6D6D6]">Bybit</div>
          </div>
          <InputWithClear
            isError={!byBitUIDValid}
            value={byBitUID}
            onValueChange={(v) => setByBitUID(v)}
            isSign={false}
            inputId="phone"
            conClass="w-full md:w-auto"
            onBlur={handleByBitBlur}
            placeHolder="UID/Email"
          />
          <InvalidTpl isValid={byBitUIDValid} />
        </div>
      </div>
    </div>
  );
}
