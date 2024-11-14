
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
    }, 1300);
    return () => clearInterval(interval);
  }, [wordTotal]);

  return (
    <div className="inline-block">
      
    </div>
  )
}

export default CircleText;