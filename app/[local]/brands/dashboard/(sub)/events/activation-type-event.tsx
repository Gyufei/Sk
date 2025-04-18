import { cn } from "@/lib/utils/utils";
import { NotEligible } from "./not-eligible";

interface IEventInfo {
  activation_code: string[];
  claim_type: string;
  claim_version: number;
  project_name: string;
  version: string;
}

export function ActivationTypeEvent({ eventInfo }: { eventInfo: IEventInfo }) {
  const { activation_code } = eventInfo;

  if (!activation_code.length) {
    return <NotEligible />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-4 sm:gap-y-6 pt-6 sm:py-10">
      {activation_code.map((code) => (
        <CodeShow key={code} code={code} />
      ))}
    </div>
  );
}

function CodeShow({ code }: { code: string }) {
  const codeStr = code.split("");

  return (
    <div className="flex gap-x-[6px] sm:gap-x-2">
      {codeStr.map((str) => (
        <div
          key={str}
          className={cn(
            "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg border text-sm sm:text-xl sm:leading-9 font-medium leading-5 text-white/80",
            str === "-"
              ? "border-transparent bg-transparent"
              : "border-white/80 bg-[#ffffff01]",
          )}
        >
          {str}
        </div>
      ))}
    </div>
  );
}
