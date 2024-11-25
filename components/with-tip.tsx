import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/utils";
import { TooltipArrow } from "@radix-ui/react-tooltip";
// import { CTooltipArrow } from "@/components/share/c-tooltip-arrow";

export function WithTip({
  className,
  children,
  align = "center",
  tipContent
}: {
  className?: string;
  children?: React.ReactNode;
  align?: "center" | "end" | "start" | undefined;
  tipContent?: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {children}
        </TooltipTrigger>
        <TooltipContent
          align={align}
          sideOffset={5}
          className={cn("z-[300]", className)}
        >
          {tipContent}
          <TooltipArrow className="TooltipArrow">
          </TooltipArrow>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}