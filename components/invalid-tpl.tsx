import { useTranslations } from "next-intl";

export function InvalidTpl({
  isValid,
  text,
}: {
  isValid: boolean;
  text?: string;
}) {
  const T = useTranslations("Common");

  if (isValid) return null;

  return (
    <div className="block text-sm leading-5 text-[#FF5A5A]">
      {text || T("InvalidFormat")}
    </div>
  );
}

export function MobileInValidTpl({
  isValid,
  text,
}: {
  isValid: boolean;
  text: string;
}) {
  if (isValid) return null;

  return (
    <div className="my-1 md:hidden">
      <InvalidTpl isValid={isValid} text={text} />
    </div>
  );
}

export function PcInvalidTpl({
  isValid,
  text,
}: {
  isValid: boolean;
  text: string;
}) {
  if (isValid) return null;

  return (
    <div className="mt-3 hidden pl-[155px] md:block">
      <InvalidTpl isValid={isValid} text={text} />
    </div>
  );
}
