"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { formatNum } from "@/lib/utils/number";
import { formatDate } from "@/lib/utils/utils";
import { useTranslations } from "next-intl";

export default function Point() {
  const T = useTranslations("Common");
  const { data: userInfo } = useFetchUserInfo();
  const activityList: any[] = [];

  return (
    <div className="mb-[20px] mt-6">
      <div className="flex flex-row items-start justify-start rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur sm:rounded-[18px] sm:p-[20px]">
        <div className="flex-1">
          <div className="font-haasDisp text-xl font-semibold text-white sm:text-[rgba(255,255,255,0.6)]">
            J {T("Points")}
          </div>
          <div className="mt-[10px] text-[40px] leading-[40px] text-white sm:leading-[60px]">
            {formatNum(userInfo?.j_points || 0)}
          </div>
        </div>
        <div className="flex-1">
          <div className="font-haasDisp text-xl font-semibold leading-[30px] text-white sm:text-[rgba(255,255,255,0.6)]">
            {T("Multipliers")}
          </div>
          <div className="flex items-center justify-between self-stretch sm:mt-[10px] sm:justify-start">
            <div className="mr-[10px] flex flex-col sm:mr-[85px]">
              <span className="font-haasDisp text-base font-medium leading-[24px] text-[rgba(255,255,255,0.6)]">
                {T("Cup")}
              </span>
              <span className="text-xl font-normal leading-[30px] text-white sm:text-[32px] sm:leading-[40px]">
                {formatNum(userInfo?.multipliers?.cup || 0)}×
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-haasDisp text-base font-medium leading-[24px] text-[rgba(255,255,255,0.6)]">
                {T("XAccount")}
              </span>
              <span className="text-xl font-normal leading-[30px] text-white sm:text-[32px] sm:leading-[40px]">
                {formatNum(userInfo?.multipliers?.x_account || 0)}×
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[14px] rounded-[20px] bg-[rgba(255,255,255,0.1)] px-[20px] py-[20px] sm:py-0 sm:mt-10 sm:bg-transparent">
        <div className="font-haasDisp text-xl font-semibold leading-[30px] text-white">
          {T("Activity")}
        </div>
        {/* !H5 Show*/}
        <div className="mt-5 hidden sm:block ">
          <Table className="text-[#D6D6D6]">
            <TableHeader>
              <TableRow className="border-none text-base">
                <TableHead className="pl-0  text-left">{T("Action")}</TableHead>
                <TableHead>{T("ArticleMultipler")}</TableHead>
                <TableHead>{T("Point")}</TableHead>
                <TableHead className="text-right">{T("Time")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!activityList?.length && (
                <TableRow className="border-none">
                  <TableCell className="pl-0 text-left">_</TableCell>
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
                    boxShadow:
                      "inset 0px -1px 0px 0px rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <TableCell className="pl-0  text-left">Like</TableCell>
                  <TableCell>4x</TableCell>
                  <TableCell>40</TableCell>
                  <TableCell className="text-right">
                    {formatDate(item.create_at)}
                  </TableCell>
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
              <div className="mb-5 w-[50%]">
                <div className="text-lg opacity-60">{T("Action")}</div>
                <div className="text-base">Lick</div>
              </div>
              <div className="mb-5 w-[50%]">
                <div className="text-lg opacity-60">
                  {T("ArticleMultipler")}
                </div>
                <div className="text-base">4x</div>
              </div>
              <div className="mb-5 w-[50%]">
                <div className="text-lg opacity-60">{T("Point")}</div>
                <div className="text-base">40</div>
              </div>
              <div className="mb-5 w-[50%]">
                <div className="text-lg opacity-60">{T("Time")}</div>
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
  );
}
