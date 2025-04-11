"use client";
import { UuidAtom } from "@/lib/api/state";
import { useAtomValue } from "jotai";
import { redirect } from "next/navigation";
import BrandsDisplay from "./brands-display";

export default function Brands() {
  const uuid = useAtomValue(UuidAtom);

  if (!uuid) {
    redirect("/login");
  }

  return (
    <div
      className={`flex w-[345px] flex-col items-center justify-center gap-0 rounded-3xl border-none bg-transparent px-0 pt-5 font-haasDisp sm:ml-[-240px] sm:h-[500px] sm:w-[500px] sm:bg-transparent`}
    >
      <BrandsDisplay />
    </div>
  );
}
