import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { ChainWorkBenchABI } from "@/lib/contract/sol/ChainWorkBench";
import { useContractAddress } from "./contract/use-contract-address";

export function useSolProgram(version: "v1" | "v2") {
  const wallet = useAnchorWallet();

  const { connection } = useConnection();
  const provider = new anchor.AnchorProvider(
    connection,
    wallet!,
    anchor.AnchorProvider.defaultOptions(),
  );
  anchor.setProvider(provider);

  const { address: ProgramAddress } = useContractAddress(
    version === "v2" ? `solana-${version}` : "solana",
  );

  const programId = new PublicKey(
    ProgramAddress || "8cEDB35SwfpVdD7hrppxN27V46UKowRTHTtwuXgqo3w6",
  );

  const chain_work_bench_program = new anchor.Program(
    ChainWorkBenchABI as any,
    programId,
    provider,
  );

  return chain_work_bench_program;
}
