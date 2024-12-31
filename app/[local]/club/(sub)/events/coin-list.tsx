
import Image from "next/image";
import { useMemo, useState } from "react";
import { CoinItem } from "./coin-item";
import { IClaimToken } from "@/lib/api/use-claim-tokens";

export function CoinList({
  claimArray = [],
  currentToken,
  onClick
}: {
  claimArray: IClaimToken[][];
  currentToken: IClaimToken;
  onClick: (t: IClaimToken) => void
}) {
  const [rowIndex, setRowIndex] = useState<number>(0);

  function changeRow(type: 'add' | 'minus') {
    let newIndex = rowIndex;

    type === 'add' ? newIndex++ : newIndex--;
    setRowIndex(newIndex)
  }

  const nullArray = useMemo(() => {
    const last = (claimArray[rowIndex] || []).length % 4;
    if (last <= 0) return [];
    return new Array(4 - last).fill(null)
  }, [claimArray, rowIndex])

  return (
    
    <div className="mt-[10px] w-full justify-between sm:mt-0  relative flex flex-row sm:gap-[20px] sm:w-[60px] sm:h-[320px] sm:py-[10px] sm:flex-col">
      {
        (claimArray[rowIndex] || []).map((t, i) => (
          <CoinItem
            disabled={false}
            key={i}
            isActive={currentToken?.name === t.name}
            onClick={() => onClick(t)}
            src={t.logo}
            name={t.name}
          />
        ))
      }
      {
        nullArray.map((item, index) => (<div key={index} className="h-[72px] w-[72px] sm:h-[60px] sm:w-[60px]"></div>))
      }
      {
        rowIndex > 0 && (
          <div className="absolute left-[-5px] top-[18px] rounded-[20px] sm:left-[12px] sm:top-[0] sm:rotate-90 bg-blur12" onClick={() => changeRow('minus')}>
            <Image src={"/icons/arrow-left.svg"} width={36} height={36} alt={""} />
          </div>
        )
      }
      {
        rowIndex < (claimArray.length -1) && (
          <div className="absolute right-[-5px] bottom-[18px] rounded-[20px] rotate-180 sm:right-[12px] sm:bottom-[0] sm:-rotate-90  bg-blur12" onClick={() => changeRow('add')}>
            <Image src={"/icons/arrow-left.svg"} width={36} height={36} alt={""} />
          </div>
        )
      }
    </div>
  );
}

