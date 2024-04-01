export function ChangeLang({
  lang,
  setLang,
}: {
  lang: "Cn" | "En";
  setLang: (lang: "Cn" | "En") => void;
}) {
  return (
    <div
      onClick={() => setLang(lang === "Cn" ? "En" : "Cn")}
      className="flex h-10 w-[100px] cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] leading-6 text-[#a8a8a8]"
    >
      <div
        data-active={lang === "Cn"}
        className="data-[active=true]:text-white"
      >
        中文
      </div>{" "}
      /{" "}
      <div
        data-active={lang === "En"}
        className="data-[active=true]:text-white"
      >
        EN
      </div>
    </div>
  );
}
