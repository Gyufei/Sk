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
          className={cn("z-[300] TooltipContent w-auto", className)}
        >
          {tipContent}
          <TooltipArrow asChild className="fill-[rgba(255, 255, 255, 0.1)]">
            {/* <CTooltipArrow /> */}
          </TooltipArrow>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}