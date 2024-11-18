import { IconBtn } from "@/components/icon-btn";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
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
  console.log(localStorage.getItem(keyword),localStorage.getItem(keyword))
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
export function EyetoggleBtn({
  eyeState,
  handleToggle
}: {
  eyeState: boolean;
  handleToggle: (newEyeState: boolean) => void;
}) {
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconBtn
            defaulImage = {eyeState === true ? "/icons/eye-open.svg" : "/icons/eye-close.svg"}
            hoverImage = {eyeState === true ? "/icons/eye-open-black.svg" : "/icons/eye-close-black.svg"}
            handleClick={ () => handleToggle(!eyeState)}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{eyeState === true ? 'Display account' : 'Hide account'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
   
  )
}
