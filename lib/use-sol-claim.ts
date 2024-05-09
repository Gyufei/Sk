import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ChainWorkBenchABI } from "@/lib/abi/sol/ChainWorkBench";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import BN from 'bn.js';
import { useState } from "react";

const ProgramAddress = '23WDf2virf2Ezw9fQs67Pv1DbpoidWFsCxKUyzqdspT3';

export function useSolClaim() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<any>();

  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const provider = new anchor.AnchorProvider(
    connection,
    wallet!,
    anchor.AnchorProvider.defaultOptions(),
  );
  anchor.setProvider(provider);

  const { publicKey: authority } = useWallet();

  const programId = new PublicKey(
    ProgramAddress
  );
  const chain_work_bench_program = new anchor.Program(
    ChainWorkBenchABI as any,
    programId,
    provider,
  );

  const systemProgram = anchor.web3.SystemProgram.programId;
  const tokenProgram = TOKEN_PROGRAM_ID;
  const associatedTokenProgram = ASSOCIATED_TOKEN_PROGRAM_ID;

  const systemConfig = PublicKey.findProgramAddressSync(
      [
          Buffer.from("system_config")
      ],
      chain_work_bench_program.programId
  )[0];


  const claimAction = async (amount: number, proofs: string[], eventsData: Record<string, any>) => {
    setIsPending(true);
    const claim_version_buf = Buffer.alloc(8);
    claim_version_buf.writeUint32LE(eventsData.claimVersion);
    const claimConfig = PublicKey.findProgramAddressSync(
        [
            Buffer.from("claim_config"),
            claim_version_buf,
            authority!.toBuffer()
        ],
        chain_work_bench_program.programId
    )[0];

    const tokenMint = new PublicKey(eventsData.token_address);

    const poolTokenAuthority = PublicKey.findProgramAddressSync(
        [
            systemConfig.toBuffer()
        ],
        chain_work_bench_program.programId
    )[0];

    const poolTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        poolTokenAuthority,
        true
    );

    const userTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        authority!,
        true
    );

    const txHash = await chain_work_bench_program.methods.claim(
        new BN(eventsData.claimVersion),
        new BN(amount),
        proofs
    ).accounts({
        authority,
        recipient: authority,
        claimConfig,
        systemConfig,
        poolTokenAuthority,
        poolTokenAccount,
        userTokenAccount,
        tokenMint,
        tokenProgram,
        associatedTokenProgram,
        systemProgram
    }).signers([]).rpc();

    setIsPending(false);
    setIsSuccess(true);
    setData(txHash);

    return txHash;
  };


  return {
    isPending,
    isSuccess,
    data,
    claimAction
  };
}
