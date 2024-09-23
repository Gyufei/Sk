import { useLang } from "@/lib/use-lang";
import { Twitter } from "./twitter";
import { Email } from "./email";
import { Discord } from "./discord";
import { Tg } from "./tg";
import { Github } from "./github";

export function SocialMedia() {
  const { isEn } = useLang();
  return (
    <div className="mt-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur md:rounded-[18px] md:p-[20px]">
      <div className="mb-7 text-xl leading-[30px] text-white">
        {isEn ? "Social Media" : "社交媒体"}
      </div>
      <Twitter />
      <Email />
      <Discord />
      <Tg />
      <Github />
    </div>
  );
}
