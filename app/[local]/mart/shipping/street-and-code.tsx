import { InputWithClear } from "@/components/input-with-clear";
import { InvalidTpl } from "@/components/invalid-tpl";
import { useTranslations } from "next-intl";

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

  const titleClass = "text-lg font-medium leading-7 text-white opacity-60";

  return (
    <div className="relative flex flex-col items-stretch space-x-0 space-y-[30px] md:mt-10 md:flex-row md:items-center md:space-x-6 md:space-y-0">
      <div className="flex flex-1 flex-col mt-[30px] md:mt-0">
        <label
          htmlFor="street"
          className={titleClass}
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
          inputClass="text-base"
        />
        <InvalidTpl isValid={streetValid} />
      </div>
      {children}
    </div>
  );
}
