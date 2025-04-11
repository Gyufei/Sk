import Image from "next/image";
import homeJson from "./home_page_config.json";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const T = await getTranslations("Common");
  const topList = homeJson.top_icon_links;
  const linkPanels = homeJson.link_panels;

  return (
    <div className="content-w-320">
      <div className="flex flex-row justify-center gap-x-5">
        {topList.map((item: any) => (
          <a key={item.link_url} href={item.link_url} target="_blank">
            <Image
              src={`/icons/${item.icon_svg}.svg`}
              width={40}
              height={40}
              className="svgIcon-40"
              alt=""
            />
          </a>
        ))}
      </div>
      <div className="mt-10 flex-col">
        {linkPanels.map((item, index) => {
          return (
            <div
              className={`font-haasDisp ${index !== 0 && "mt-10"}`}
              key={item.caption}
            >
              <div className="text-[rgba(255, 255, 255, 0.8)] mb-[20px] text-center text-xl font-semibold leading-[30px]">
                {T(item.caption)}
              </div>
              {item.links.map((linkItem) => (
                <a
                  className="mt-[15px] flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-solid border-[rgba(255,255,255,0.6)] text-base leading-6 text-[rgba(255,255,255,0.6)] hover:brightness-75 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=false]:hover:brightness-100"
                  key={linkItem.link_url}
                  href={linkItem.link_url}
                  target="_blank"
                >
                  {T(linkItem.text)}
                </a>
              ))}
            </div>
          );
        })}
        <div></div>
      </div>
    </div>
  );
}
