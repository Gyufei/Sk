"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { formatNum } from "@/lib/utils/number";
import { formatDate } from "@/lib/utils/utils";
import { useTranslations } from "next-intl";

export default function Page() {
  const T = useTranslations("Common");
  const { data: userInfo } = useFetchUserInfo();
  const activityList: any[] = [];

  return (
    <div className="relative m-t-20 content-w-608">
      <div className="mb-[20px] sm:mt-6 sm:min-h-[500px]">
        <div className="flex flex-row items-start justify-start sm:p-0 p-3">
          <div className="flex-1">
            <div className="text-xl font-haasDisp font-semibold text-white sm:text-[rgba(255,255,255,0.6)]">
              J {T("Points")}
            </div>
            <div className="mt-[10px] text-[40px] leading-[40px] sm:leading-[60px] text-white">
              {formatNum(userInfo?.j_points || 0)}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xl leading-[30px] font-haasDisp font-semibold text-white sm:text-[rgba(255,255,255,0.6)]">
              {T("Multipliers")}
            </div>
            <div className="sm:mt-[10px] flex items-center justify-between sm:justify-start self-stretch">
              <div className="sm:mr-[85px] mr-[10px] flex flex-col">
                <span className="font-haasDisp text-base font-medium leading-[24px] text-[rgba(255,255,255,0.6)]">
                  {T("Cup")}
                </span>
                <span className="text-xl sm:text-[32px] font-normal leading-[30px] sm:leading-[40px] text-white">
                  {formatNum(userInfo?.multipliers?.cup || 0)}×
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-haasDisp text-base font-medium leading-[24px] text-[rgba(255,255,255,0.6)]">
                  {T("XAccount")}
                </span>
                <span className="text-xl sm:text-[32px] font-normal leading-[30px] sm:leading-[40px] text-white">
                  {formatNum(userInfo?.multipliers?.x_account || 0)}×
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[14px] sm:mt-10 px-[20px] py-[20px] bg-[rgba(255,255,255,0.1)] rounded-[20px] sm:bg-transparent sm:p-0">
          <div className="font-haasDisp text-xl font-semibold leading-[30px] text-white">
            {T("Activity")}
          </div>
          {/* !H5 Show*/}
          <div className="mt-5 hidden sm:block ">
           <Table className="text-[#D6D6D6]">
            <TableHeader>
              <TableRow className="border-none text-base">
                <TableHead className="text-left  pl-0">{T("Action")}</TableHead>
                <TableHead>{T("ArticleMultipler")}</TableHead>
                <TableHead>{T("Point")}</TableHead>
                <TableHead className="text-right">{T("Time")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {!activityList?.length && (
              <TableRow 
                className="border-none" 
              >
                <TableCell className="text-left pl-0">_</TableCell>
                <TableCell>_</TableCell>
                <TableCell>_</TableCell>
                <TableCell className="text-right">_</TableCell>
              </TableRow>
            )}
            {(activityList || [])?.map((item: any, index: number) => (
                <TableRow 
                  key={index} 
                  className="border-none" 
                  style={{
                    boxShadow: "inset 0px -1px 0px 0px rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <TableCell className="text-left  pl-0">Like</TableCell>
                  <TableCell>4x</TableCell>
                  <TableCell>40</TableCell>
                  <TableCell className="text-right">{formatDate(item.create_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
           {/* H5 Show */}
          <div className="sm:hidden">
            {(activityList || [])?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="mt-5 flex flex-row flex-wrap"
                  style={{
                    boxShadow: "inset 0px -1px 0px 0px rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <div className="w-[50%] mb-5">
                    <div className="opacity-60 text-lg">{T("Action")}</div>
                    <div className="text-base">Lick</div>
                  </div>
                  <div className="w-[50%] mb-5">
                    <div className="opacity-60 text-lg">{T("ArticleMultipler")}</div>
                    <div className="text-base">4x</div>
                  </div>
                  <div className="w-[50%] mb-5">
                    <div className="opacity-60 text-lg">{T("Point")}</div>
                    <div className="text-base">40</div>
                  </div>
                  <div className="w-[50%] mb-5">
                    <div className="opacity-60 text-lg">{T("Time")}</div>
                    <div className="text-base">{formatDate(item.create_at)}</div>
                  </div>
                  
                </div>
              ))}
              {!activityList?.length && (
              <div className="flex h-[50px] items-center justify-start text-xl">
                {T("NoData")}
              </div>
            )}
          </div>
      </div>

      </div>
    </div>
  );
}
