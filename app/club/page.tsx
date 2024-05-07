"use client";
import { useState } from "react";
import { MemberInfo } from "./member-info";
import SignDialog from "@/components/sign-dialog";
import { useAccount } from "wagmi";
import { useAtomValue } from "jotai/react";
import { UuidAtom } from "@/lib/state";

export default function Club() {
  const { address } = useAccount();
  const uuid = useAtomValue(UuidAtom);
  console.log(`Club uuid:${uuid}`);

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
