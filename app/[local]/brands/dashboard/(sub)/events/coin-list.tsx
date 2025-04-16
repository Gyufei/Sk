import Image from "next/image";
import { useMemo, useState } from "react";
import { CoinItem } from "./coin-item";
import { IClaimToken } from "@/lib/api/use-claim-tokens";

export function CoinList({
  claimArray = [],
  currentToken,
  onClick,
}: {
  claimArray: IClaimToken[][];
  currentToken: IClaimToken;
  onClick: (t: IClaimToken) => void;
}) {
  const [rowIndex, setRowIndex] = useState<number>(0);

  function changeRow(type: "add" | "minus") {
    let newIndex = rowIndex;

    type === "add" ? newIndex++ : newIndex--;
    setRowIndex(newIndex);
  }

  const nullArray = useMemo(() => {
    const last = (claimArray[rowIndex] || []).length % 4;
    if (last <= 0) return [];
    return new Array(4 - last).fill(null);
  }, [claimArray, rowIndex]);

  return (
    <div className="relative mt-[10px] flex w-full  flex-row justify-between sm:mt-0 sm:h-[320px] sm:w-[60px] sm:flex-col sm:gap-[20px] sm:py-[10px]">
      {(claimArray[rowIndex] || []).map((t, i) => (
        <CoinItem
          disabled={false}
          key={i}
          isActive={currentToken?.name === t.name}
          onClick={() => onClick(t)}
          src={t.logo}
          name={t.name}
        />
      ))}
      {nullArray.map((item, index) => (
        <div
          key={index}
          className="h-[72px] w-[72px] sm:h-[60px] sm:w-[60px]"
        ></div>
      ))}
      {rowIndex > 0 && (
        <div
          className="bg-blur12 absolute left-[-5px] top-[18px] rounded-[20px] sm:left-[12px] sm:top-[0] sm:rotate-90"
          onClick={() => changeRow("minus")}
        >
          <Image
            src={"/icons/arrow-left.svg"}
            width={36}
            height={36}
            alt={""}
          />
        </div>
      )}
      {rowIndex < claimArray.length - 1 && (
        <div
          className="bg-blur12 absolute bottom-[18px] right-[-5px] rotate-180 rounded-[20px] sm:bottom-[0] sm:right-[12px]  sm:-rotate-90"
          onClick={() => changeRow("add")}
        >
          <Image
            src={"/icons/arrow-left.svg"}
            width={36}
            height={36}
            alt={""}
          />
        </div>
      )}
    </div>
  );
}
