import useSWR from "swr";
import { PublicKey } from "@solana/web3.js";
import { useSolProgram } from "./use-sol-program";
import { useMemo } from "react";
import { IClaimToken } from "./api/use-claim-tokens";
import { useFetchUserInfo } from "./api/use-fetch-user-info";

export function useCheckSolClaimed(currentToken: IClaimToken | undefined) {
  const { data: userInfo } = useFetchUserInfo();

  const isSolana = currentToken?.chainInfo?.name?.toLowerCase() === "solana";
  const eventsData = currentToken?.eventData;
  const chain_work_bench_program = useSolProgram();
  const uid = userInfo?.uid;

  async function GetState() {
    if (!eventsData || !uid || !isSolana) return null;

    const claim_version_buf = Buffer.alloc(8);
    claim_version_buf.writeUint32LE(eventsData.claim_version);

    const uidBuf = Buffer.alloc(8);
    uidBuf.writeUint32LE(uid);

    const claimConfig = PublicKey.findProgramAddressSync(
      [Buffer.from("claim_config"), claim_version_buf, uidBuf],
      chain_work_bench_program.programId,
    )[0];

    const res = await chain_work_bench_program?.account.claimConfig.fetch(
      claimConfig,
    );

    return res as { claimed: boolean };
  }

  const apiPoint = useMemo(() => {
    if (!eventsData || !uid || !isSolana || currentToken?.isCutOff) return null;

    return JSON.stringify({
      eventsData,
      isSolanaFlag: isSolana,
      reqFlag: uid,
    });
  }, [eventsData, isSolana, uid, currentToken?.isCutOff]);

  const res = useSWR(apiPoint, GetState);

  return res;
}
