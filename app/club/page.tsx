"use client";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai/react";

import SignDialog from "@/components/sign-dialog";

import { UuidAtom } from "@/lib/state";

import RouterMenu from "./router-menu";

import "@solana/wallet-adapter-react-ui/styles.css";
import "@mysten/dapp-kit/dist/index.css";

export default function Club() {
  const uuid = useAtomValue(UuidAtom);

  const [init, setInit] = useState(false);

  useEffect(() => {
    setInit(true);
  }, []);

  if (!init) return null;

  return <>{uuid ? <RouterMenu /> : <SignDialog />}</>;
}
