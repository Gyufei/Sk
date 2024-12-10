
import { useEffect, useState } from "react";

type CircleTextProps = {
  words: string[]
}


function CircleText({
  words
}: CircleTextProps) {
  const [wordIndex, setWordIndex] = useState(0);
 
  const wordTotal = words.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((current) => (current + 1) % wordTotal);
    }, 2000);
    return () => clearInterval(interval);
  }, [wordTotal]);

  return (
    <div
      data-active=""
      className="inline-flex items-center justify-center ml-1 sm:ml-[14px] px-[16px] h-[28px] text-[14px] sm:h-[32px] text-center border border-white/60 rounded-lg sm:text-base">
        <span className={`animate-[textCircle_2s_ease-in_infinite]`}>{words[wordIndex]}</span>
    </div>
  )
}

export default CircleText;