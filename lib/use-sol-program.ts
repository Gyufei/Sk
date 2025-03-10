import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { ChainWorkBenchABI } from "./contract/sol/ChainWorkBench";

export function useSolProgram(address: string) {
  const wallet = useAnchorWallet();

  const { connection } = useConnection();

  const provider = new anchor.AnchorProvider(
    connection,
    wallet!,
    anchor.AnchorProvider.defaultOptions(),
  );
  anchor.setProvider(provider);

  const programId = new PublicKey(address);

  const chain_work_bench_program = new anchor.Program(
    ChainWorkBenchABI as any,
    programId,
    provider,
  );

  return chain_work_bench_program;
}
