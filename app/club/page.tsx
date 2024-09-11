"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAtomValue } from "jotai/react";

import SignDialog from "@/components/sign-dialog";

import { UuidAtom } from "@/lib/state";

import RouterMenu from "./router-menu";

import "@solana/wallet-adapter-react-ui/styles.css";

export default function Club() {
  const { address } = useAccount();
  const uuid = useAtomValue(UuidAtom);

  const [dialogOpen, setOpen] = useState(false);

  const [init, setInit] = useState(false);

  useEffect(() => {
    setInit(true);
  }, []);

  if (!init) return null;

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
