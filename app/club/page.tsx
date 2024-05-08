"use client";
import { useState } from "react";
import SignDialog from "@/components/sign-dialog";
import { useAccount } from "wagmi";
import { useAtomValue } from "jotai/react";
import { UuidAtom } from "@/lib/state";
import RouterMenu from "./router-menu";

import "@solana/wallet-adapter-react-ui/styles.css";
import "@mysten/dapp-kit/dist/index.css";

export default function Club() {
  const { address } = useAccount();
  const uuid = useAtomValue(UuidAtom);
  console.log(`Club uuid:${uuid}`);

  const [dialogOpen, setOpen] = useState(false);

  return (
    <>
      {uuid && address ? (
        <RouterMenu />
      ) : (
        <SignDialog dialogOpen={dialogOpen} setDialogOpen={setOpen} />
      )}
    </>
  );
}
