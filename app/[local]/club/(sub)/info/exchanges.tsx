import { InvalidTpl } from "./invalid-tpl";
import { useEffect, useState } from "react";
import { InputWithClear } from "@/components/input-with-clear";
import { checkEmailRegex } from "@/lib/utils/utils";
import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
import { useAtomValue } from "jotai";
import { UuidAtom } from "@/lib/api/state";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useTranslations } from "next-intl";

export function Exchanges() {
  const T = useTranslations("Common");

  const uuid = useAtomValue(UuidAtom);
  const { data: userInfo } = useFetchUserInfo();

  const [bnUID, setBnUID] = useState("");
  const [bnUIDValid, setBnUIDValid] = useState(true);
  const [okxUID, setOKXUID] = useState("");
  const [okxUIDValid, setOKXUIDValid] = useState(true);
  const [byBitUID, setByBitUID] = useState("");
  const [byBitUIDValid, setByBitUIDValid] = useState(true);

  useEffect(() => {
    if (userInfo?.exchanges) {
      setBnUID(userInfo?.exchanges?.binance_uid || "");
      setOKXUID(userInfo?.exchanges?.okx_uid || "");
      setByBitUID(userInfo?.exchanges?.bybit_uid || "");
    }
  }, [userInfo]);

  function handleBnBlur() {
    if (!bnUID) return true;

    const isNumRegex = checkUIdRegex(bnUID);
    const isEmailRegex = checkEmailRegex(bnUID);

    const isValid = isNumRegex || isEmailRegex;
    setBnUIDValid(isValid);

    if (isValid) {
      saveExchange();
    }
  }

  function handleOkxBlur() {
    if (!okxUID) return true;

    const isNumRegex = checkUIdRegex(okxUID);
    const isEmailRegex = checkEmailRegex(okxUID);

    const isValid = isNumRegex || isEmailRegex;
    setOKXUIDValid(isValid);

    if (isValid) {
      saveExchange();
    }
  }

  function handleByBitBlur() {
    if (!byBitUID) return true;

    const isNumRegex = checkUIdRegex(byBitUID);
    const isEmailRegex = checkEmailRegex(byBitUID);

    const isValid = isNumRegex || isEmailRegex;
    setByBitUIDValid(isValid);

    if (isValid) {
      saveExchange();
    }
  }

  function checkUIdRegex(v: string) {
    const number = /^\d{6,15}$/;
    return number.test(v);
  }

  async function saveExchange() {
    const res: any = await fetcher(`${ApiHost}/user/exchanges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        binance_uid: bnUID,
        okx_uid: okxUID,
        bybit_uid: byBitUID,
      }),
    });

    if (!res) {
      console.error("saveExchange error");
    }
  }

  return (
    <div className="mt-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur md:rounded-[18px] md:p-[20px]">
      <div className="mb-5 text-xl leading-[30px] text-white">
        {T("Exchanges")}
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
