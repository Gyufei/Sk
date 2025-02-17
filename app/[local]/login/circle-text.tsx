import { useEffect, useState } from "react";

type CircleTextProps = {
  words: string[];
};

function CircleText({ words }: CircleTextProps) {
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
      className="ml-1 inline-flex h-[28px] items-center justify-center rounded-lg border border-white/60 px-[16px] text-center text-[14px] sm:ml-[14px] sm:h-[32px] sm:text-base"
    >
      <span className={`animate-[textCircle_2s_ease-in_infinite]`}>
        {words[wordIndex]}
      </span>
    </div>
  );
}

export default CircleText;
