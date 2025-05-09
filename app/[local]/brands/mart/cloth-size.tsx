import { useTranslations } from "next-intl";

export function ClothSize() {
  const T = useTranslations("Common");

  const sizeData = [
    {
      size: "XXS",
      heightRef: "156-163",
      clothingLength: "69",
      bust: "54",
      shoulderWidth: "45.5",
      sleeveLength: "22",
    },
    {
      size: "XS",
      heightRef: "163-170",
      clothingLength: "70.5",
      bust: "56",
      shoulderWidth: "47",
      sleeveLength: "22.5",
    },
    {
      size: "S",
      heightRef: "170-175",
      clothingLength: "72",
      bust: "58",
      shoulderWidth: "48.5",
      sleeveLength: "23",
    },
    {
      size: "M",
      heightRef: "175-180",
      clothingLength: "73.5",
      bust: "60",
      shoulderWidth: "50",
      sleeveLength: "23.5",
    },
    {
      size: "L",
      heightRef: "180-185",
      clothingLength: "75",
      bust: "62",
      shoulderWidth: "51.5",
      sleeveLength: "24",
    },
    {
      size: "XL",
      heightRef: "185-190",
      clothingLength: "76.5",
      bust: "64",
      shoulderWidth: "53",
      sleeveLength: "24.5",
    },
  ];

  return (
    <div className="flex justify-center">
      <div className="w-full rounded-xl border border-[#ffffff20] text-xs text-[#d6d6d6]">
        <div className="grid h-12 grid-cols-6 items-center">
          <div className="flex justify-center text-center">{T("Size")}</div>
          <div className="flex justify-center break-words text-center">
            {T("HeightReference")}
          </div>
          <div className="flex justify-center text-center">
            {T("ClothingLength")}
          </div>
          <div className="flex justify-center text-center">{T("Bust")}</div>
          <div className="flex justify-center text-center">
            {T("ShoulderWidth")}
          </div>
          <div className="flex justify-center text-center">
            {T("SleeveLength")}
          </div>
        </div>
        {sizeData.map((item) => (
          <div
            className="grid h-12 grid-cols-6 items-center border-t border-[#ffffff20]"
            key={item.size}
          >
            <div className="flex justify-center text-center">{item.size}</div>
            <div className="flex justify-center text-center">
              {item.heightRef}
            </div>
            <div className="flex justify-center text-center">
              {item.clothingLength}
            </div>
            <div className="flex justify-center text-center">{item.bust}</div>
            <div className="flex justify-center text-center">
              {item.shoulderWidth}
            </div>
            <div className="flex justify-center text-center">
              {item.sleeveLength}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
