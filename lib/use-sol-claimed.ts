import useSWR from "swr";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolProgram } from "./use-sol-program";
import { useMemo } from "react";

export function useSolClaimed(isSolanaFlag: boolean, eventsData: Record<'claim_version' | 'token_address', any>) {
  const { publicKey: authority } = useWallet();
  const chain_work_bench_program = useSolProgram();

  async function GetState() {
    if (!eventsData || !authority || !isSolanaFlag) return null;

    const claim_version_buf = Buffer.alloc(8);
    claim_version_buf.writeUint32LE(eventsData.claim_version);

    const claimConfig = PublicKey.findProgramAddressSync(
        [
            Buffer.from("claim_config"),
            claim_version_buf,
            authority!.toBuffer()
        ],
        chain_work_bench_program.programId
    )[0];

    const res = await chain_work_bench_program?.account.claimConfig.fetch(claimConfig);

    return res as { claimed: boolean};
  }

  const apiPoint = useMemo(() => {
    if (!eventsData || !authority || !isSolanaFlag) return null;

    return JSON.stringify({
      eventsData,
      authority: authority.toBase58(),
      isSolanaFlag
    })
  }, [eventsData, authority, isSolanaFlag])

  const res = useSWR(apiPoint, GetState);

  return res;
}
