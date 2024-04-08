import { useEffect, useState } from "react";

export function useLang() {
  const [lang, setLang] = useState("En");

  const isEn = lang === "En";
  const isCn = lang === "Cn";

  useEffect(() => {
    localStorage.removeItem("lang");

    const currentLang = navigator.language;
    if (currentLang === "zh-CN") {
      setLang("Cn");
    } else {
      setLang("En");
    }
  }, [setLang]);

  return {
    lang,
    isEn,
    isCn,
  };
}
