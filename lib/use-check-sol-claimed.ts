import useSWR from "swr";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolProgram } from "./use-sol-program";
import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { UuidAtom } from "./api/state";

export function useCheckSolClaimed(
  isSolanaFlag: boolean,
  eventsData: Record<"claim_version" | "token_address" | "version", any> | null,
) {
  const { publicKey: authority } = useWallet();
  const Uuid = useAtomValue(UuidAtom);

  const chain_work_bench_program = useSolProgram(eventsData?.version);
  const isV2 = eventsData?.version === "v2";

  async function GetState() {
    if (isV2) {
      return GetStateV2();
    } else {
      return GetStateV1();
    }
  }

  async function GetStateV1() {
    if (!eventsData || !authority || !isSolanaFlag) return null;

    const claim_version_buf = Buffer.alloc(8);
    claim_version_buf.writeUint32LE(eventsData.claim_version);

    const claimConfig = PublicKey.findProgramAddressSync(
      [Buffer.from("claim_config"), claim_version_buf, authority!.toBuffer()],
      chain_work_bench_program.programId,
    )[0];

    const res = await chain_work_bench_program?.account.claimConfig.fetch(
      claimConfig,
    );

    return res as { claimed: boolean };
  }

  async function GetStateV2() {
    if (!eventsData || !Uuid || !isSolanaFlag) return null;

    const claim_version_buf = Buffer.alloc(8);
    claim_version_buf.writeUint32LE(eventsData.claim_version);

    const uuidBuf = Buffer.from(Uuid);

    const claimConfig = PublicKey.findProgramAddressSync(
      [Buffer.from("claim_config"), claim_version_buf, uuidBuf],
      chain_work_bench_program.programId,
    )[0];

    const res = await chain_work_bench_program?.account.claimConfig.fetch(
      claimConfig,
    );

    return res as { claimed: boolean };
  }

  const apiPoint = useMemo(() => {
    if (!eventsData || !(isV2 ? Uuid : authority) || !isSolanaFlag) return null;

    return JSON.stringify({
      eventsData,
      isSolanaFlag,
      reqFlag: isV2 ? Uuid : authority?.toBase58(),
    });
  }, [eventsData, authority, isSolanaFlag, Uuid, isV2]);

  const res = useSWR(apiPoint, GetState);

  return res;
}
