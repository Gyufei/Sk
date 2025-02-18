import { IconBtn } from "@/components/icon-btn";
import { WithTip } from "@/components/with-tip";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function useEyeToggle({
  keyword
}: {
  keyword: string
}): {
  eyeState: boolean;
  handleToggle: (newEyeState: boolean) => void;
} {
  const  eyeDefaultState = !!localStorage.getItem(keyword);
  const [eyeState, setEyeState] = useState<boolean>(eyeDefaultState);
  const handleToggle = (newEyeState: boolean) => {
    setEyeState(newEyeState);
    if (newEyeState) {
      localStorage.setItem(keyword, 'true')
    } else {
      localStorage.removeItem(keyword)
    }
  }
  return {
    eyeState,
    handleToggle
  };
} 
export function EyeToggleBtn({
  eyeState,
  handleToggle
}: {
  eyeState: boolean;
  handleToggle: (newEyeState: boolean) => void;
}) {
  const T = useTranslations("Common");
  return (
    <>
      <IconBtn
        mobileHoverColorChanged={false}
        className={'border-0  absolute mt-0 right-[-5px] top-[-10px] sm:hidden'}
        defaultImage = {eyeState === true ? "/icons/eye-open.svg" : "/icons/eye-close.svg"}
        hoverImage = {eyeState === true ? "/icons/eye-open-black.svg" : "/icons/eye-close-black.svg"}
        handleClick={() => handleToggle(!eyeState)}
      />
      <WithTip
        tipContent={<div>{ T(eyeState === true ? 'DisplayAccount' : 'HideAccount')}</div>}>
        <IconBtn
          mobileHoverColorChanged={false}
          className={'hidden  sm:flex  sm:mt-[0px]'}
          defaultImage = {eyeState === true ? "/icons/eye-close.svg" : "/icons/eye-open.svg"}
          hoverImage = {eyeState === true ? "/icons/eye-open-black.svg" : "/icons/eye-close-black.svg"}
          handleClick={() => handleToggle(!eyeState)}
        />
      </WithTip>
    </>
    
    
  )
}

