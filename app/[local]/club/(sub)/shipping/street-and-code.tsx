import { InputWithClear } from "@/components/input-with-clear";
import { useTranslations } from "next-intl";
import { InvalidTpl } from "../info/invalid-tpl";

export function StreetAndCode({
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
  const T = useTranslations("Common");

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
      <div className="flex flex-1 flex-col pb-6">
        <label
          htmlFor="street"
          className="text-lg font-normal leading-7 text-white opacity-60"
        >
          {T("AddressLine")}
        </label>
        <InputWithClear
          isError={!streetValid}
          value={street}
          onValueChange={(v) => handleStreetChange(v)}
          isSign={false}
          inputId="street"
          onBlur={handleStreetBlur}
        />
        <InvalidTpl isValid={streetValid} />
      </div>

      <div className="flex flex-1 flex-col pb-6">
        <label
          htmlFor="code"
          className="text-lg font-normal leading-7 text-white opacity-60"
        >
          {T("ZipCode")}
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
