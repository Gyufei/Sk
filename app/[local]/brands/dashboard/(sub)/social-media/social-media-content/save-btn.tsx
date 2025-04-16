import { useTranslations } from "next-intl";
import { IconBtn } from "@/components/icon-btn";

export function SaveBtn({
  disabled,
  handleSave,
}: {
  disabled: boolean;
  handleSave: () => void;
  className?: string;
}) {
  const T = useTranslations("Common");
  return (
    <IconBtn 
      disabled={disabled}
      handleClick={handleSave}
      className="w-full mt-[20px]"
      btnText={T("Save")}
    />
  );
}

