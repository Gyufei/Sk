import { useAtom } from "jotai/react";
import { LangAtom } from "./state";
import { useEffect } from "react";

export function useLang() {
  const [lang, setLang] = useAtom(LangAtom);

  const isEn = lang === "En";
  const isCn = lang === "Cn";

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("lang") || "")) return;

    const currentLang = navigator.language;
    if (currentLang === "zh-CN") {
      setLang("Cn");
    } else {
      setLang("En");
    }
  }, [setLang]);

  return {
    lang,
    setLang,
    isEn,
    isCn,
  };
}
