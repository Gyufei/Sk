"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { formatNum } from "@/lib/utils/number";
import { formatDate } from "@/lib/utils/utils";
import { useTranslations } from "next-intl";

export default function Page() {
  const T = useTranslations("Common");
  const { data: userInfo } = useFetchUserInfo();
  const activityList: any[] = [
    { content: 'A', create_at: '2024-4-1 23:11:11' },
    { content: 'B', create_at: '2024-4-1 23:11:11' },
  ];

  return (
    <div className="relative w-full  m-t-20">
      <div className="mb-[20px] mt-6 content-w-700 ">
        <div className="flex flex-row items-start justify-start md:p-6 p-3 backdrop-blur-md">
          <div className="flex-1">
            <div className="font-haasDisp md:text-2xl text-base font-semibold text-[rgba(255,255,255,0.6)]">
              J {T("Points")}
            </div>
            <div className="mt-2 text-[40px] leading-[60px] text-white">
              {formatNum(userInfo?.j_points || 0)}
            </div>
          </div>
          <div className="flex-1">
            <div className="font-haasDisp md:text-2xl text-base font-semibold text-[rgba(255,255,255,0.6)]">
              {T("Multipliers")}
            </div>
            <div className="mt-[10px] flex items-center justify-start self-stretch">
              <div className="md:mr-[85px] mr-[10px] flex flex-col">
                <span className="text-xl font-medium leading-[30px] text-[rgba(255,255,255,0.6)]">
                  {T("Cup")}
                </span>
                <span className="text-[32px] leading-[40px] text-white">
                  {formatNum(userInfo?.multipliers?.cup || 0)}×
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-medium leading-[30px] text-[rgba(255,255,255,0.6)]">
                  {T("XAccount")}
                </span>
                <span className="text-[32px] leading-[40px] text-white">
                  {formatNum(userInfo?.multipliers?.x_account || 0)}×
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 px-6">
          <div className="font-haasDisp text-xl font-semibold leading-[30px] text-white">
            {T("Activity")}
          </div>
          <div className="mt-5">
            
           <Table className="text-[#D6D6D6]">
            <TableHeader>
              <TableRow className="border-none">
                <TableHead>{T("Action")}</TableHead>
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
                <TableCell className="font-medium">_</TableCell>
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
                  <TableCell className="font-medium">Like</TableCell>
                  <TableCell>4x</TableCell>
                  <TableCell>40</TableCell>
                  <TableCell className="text-right">{formatDate(item.create_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
      </div>

      </div>
    </div>
  );
}
