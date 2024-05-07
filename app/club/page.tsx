"use client";
import { useState } from "react";
import { MemberInfo } from "./member-info";
import SignDialog from "@/components/sign-dialog";
import { useAccount } from "wagmi";
import { useAtomValue } from "jotai/react";
import { UserInfoAtom, UuidAtom } from "@/lib/state";
// import { useLang } from "@/lib/use-lang";

export default function Club() {
  const { address } = useAccount();
  const uuid = useAtomValue(UuidAtom);
  useAtomValue(UserInfoAtom);
  // const { isEn } = useLang();

  const [dialogOpen, setOpen] = useState(false);

  return (
    <>
      {uuid && address ? (
        <MemberInfo />
      ) : (
        <SignDialog dialogOpen={dialogOpen} setDialogOpen={setOpen} />
      )}
    </>
  );
}
