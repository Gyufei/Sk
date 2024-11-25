import { IconBtn } from "@/components/icon-btn";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useState } from "react";

export function useEyeToggle({ keyword }: { keyword: string }): {
  eyeState: boolean;
  handleToggle: (newEyeState: boolean) => void;
} {
  const eyeDefaultState = !!localStorage.getItem(keyword);
  const [eyeState, setEyeState] = useState<boolean>(eyeDefaultState);
  const handleToggle = (newEyeState: boolean) => {
    setEyeState(newEyeState);
    if (newEyeState) {
      localStorage.setItem(keyword, "true");
    } else {
      localStorage.removeItem(keyword);
    }
  };
  return {
    eyeState,
    handleToggle,
  };
}
export function EyeToggleBtn({
  eyeState,
  handleToggle,
}: {
  eyeState: boolean;
  handleToggle: (newEyeState: boolean) => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconBtn
            mobileHoverColorChanged={false}
            className={
              "absolute right-[-5px] top-[-10px] mt-0 border-0 md:static md:mt-[0px] md:border"
            }
            defaulImage={
              eyeState === true ? "/icons/eye-open.svg" : "/icons/eye-close.svg"
            }
            hoverImage={
              eyeState === true
                ? "/icons/eye-open-black.svg"
                : "/icons/eye-close-black.svg"
            }
            handleClick={() => handleToggle(!eyeState)}
          />
        </TooltipTrigger>
        <TooltipContent>
          <div>{eyeState === true ? "Display account" : "Hide account"}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
