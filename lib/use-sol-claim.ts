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

const ProgramAddress = 'GDTrePtt7tmGZ5tzk8w6tYdDamY2TzYXozowWnRLsB3k';

export function useSolClaim() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<any>();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>()

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
    try {
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
      // const tokenMint = new PublicKey('BoXxLrd1FbYj4Dr22B5tNBSP92fiTmFhHEkRAhN2wDxZ');

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

      const proofArg = proofs.map(
          (proof) => new Uint8Array(Buffer.from(proof, 'hex'))
      )

      const txHash = await chain_work_bench_program.methods.claim(
          new BN(eventsData.claimVersion),
          // new BN(1000000000000),
          new BN(amount),
          proofArg
          // [
          //   '0x96201e95870d8a3471b4cdbd182ac5baa63ad44bf61cf345f6d7d8ec059fb00a'
          // ].map(
          //     (proof) => 
          //       // Buffer.from(proof.slice(2), 'hex')
          //       new Uint8Array(Buffer.from(proof.slice(2), 'hex'))
          // )
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
    } catch(e) {
      setIsError(true)
      setError(e)
      return error
    }
  };


  return {
    isPending,
    isSuccess,
    isError,
    error,
    data,
    claimAction
  };
}
