"use client";
import Home from "../one/page";
import { UuidAtom } from "@/lib/api/state";
import { useAtomValue } from "jotai";
import { redirect } from "next/navigation";

export default function Brands() {
  const uuid = useAtomValue(UuidAtom);

  if (!uuid) {
    redirect("/login");
  }

  return <Home />;
}
