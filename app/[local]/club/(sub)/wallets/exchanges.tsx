import { useEffect, useState } from "react";
import { InputWithClear } from "@/components/input-with-clear";
import { checkEmailRegex } from "@/lib/utils/utils";
import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
import { useAtomValue } from "jotai";
import { UuidAtom } from "@/lib/api/state";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useTranslations } from "next-intl";
import { InvalidTpl } from "@/components/invalid-tpl";

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
    if (!bnUID) {
      saveExchange();
      setBnUIDValid(true);
      return;
    }

    const isNumRegex = checkUIdRegex(bnUID);
    const isEmailRegex = checkEmailRegex(bnUID);

    const isValid = isNumRegex || isEmailRegex;
    setBnUIDValid(isValid);

    if (isValid) {
      saveExchange();
    }
  }

  function handleOkxBlur() {
    if (!okxUID) {
      saveExchange();
      setOKXUIDValid(true);
      return;
    }

    const isNumRegex = checkOkxUIdRegex(okxUID);
    const isEmailRegex = checkEmailRegex(okxUID);

    const isValid = isNumRegex || isEmailRegex;
    setOKXUIDValid(isValid);

    if (isValid) {
      saveExchange();
    }
  }

  function handleByBitBlur() {
    if (!byBitUID) {
      saveExchange();
      setByBitUIDValid(true);
      return;
    }

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

  function checkOkxUIdRegex(v: string) {
    const number = /^\d{6,20}$/;
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
    <div className="mt-[15px] sm:mt-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur sm:rounded-[18px] sm:p-[20px]">
      <div className="font-semibold mb-5 text-xl leading-[30px] text-white">
        {T("Exchanges")}
      </div>
      <div className="flex flex-col space-y-[30px] sm:flex-row sm:justify-between sm:space-y-0">
        <div className="flex flex-col items-start">
          <div className="flex w-[140px] items-center space-x-2">
            <div className="text-[18px] sm:text-base font-medium leading-6 text-[#D6D6D6]">Binance</div>
          </div>
          <InputWithClear
            isError={!bnUIDValid}
            value={bnUID}
            onValueChange={(v) => {
              if (!v) setBnUIDValid(true)
              setBnUID(v)
            }}
            isSign={false}
            inputId="phone"
            conClass="w-full sm:w-auto"
            onBlur={handleBnBlur}
            placeHolder="UID / Email"
          />
          <InvalidTpl isValid={bnUIDValid} />
        </div>
        <div className="flex flex-col items-start">
          <div className="flex w-[140px] items-center space-x-2">
            <div className="text-[18px] sm:text-base font-medium leading-6 text-[#D6D6D6]">OKX</div>
          </div>
          <InputWithClear
            isError={!okxUIDValid}
            value={okxUID}
            onValueChange={(v) => {
              if (!v) setOKXUIDValid(true)
              setOKXUID(v)
            }}
            isSign={false}
            inputId="phone"
            conClass="w-full sm:w-auto"
            onBlur={handleOkxBlur}
            placeHolder="UID / Email"
          />
          <InvalidTpl isValid={okxUIDValid} />
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-2 sm:w-[140px]">
            <div className="text-[18px] sm:text-base font-medium leading-6 text-[#D6D6D6]">Bybit</div>
          </div>
          <InputWithClear
            isError={!byBitUIDValid}
            value={byBitUID}
            onValueChange={(v) => {
              if (!v) setByBitUIDValid(true)
              setByBitUID(v)
            }}
            isSign={false}
            inputId="phone"
            conClass="w-full sm:w-auto"
            onBlur={handleByBitBlur}
            placeHolder="UID / Email"
          />
          <InvalidTpl isValid={byBitUIDValid} />
        </div>
      </div>
    </div>
  );
}
