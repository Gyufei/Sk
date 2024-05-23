import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import BN from 'bn.js';
import { useSolProgram } from "./use-sol-program";
import { useState } from "react";

export function useSolClaim() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<any>();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>()

  const { publicKey: authority } = useWallet();

  const chain_work_bench_program = useSolProgram();

  const systemProgram = anchor.web3.SystemProgram.programId;
  const tokenProgram = TOKEN_PROGRAM_ID;
  const associatedTokenProgram = ASSOCIATED_TOKEN_PROGRAM_ID;

  const systemConfig = PublicKey.findProgramAddressSync(
      [
          Buffer.from("system_config")
      ],
      chain_work_bench_program.programId
  )[0];

  const claimAction = async (amount: number, proofs: string[], eventsData: Record<'claim_version' | 'token_address', any>) => {
    setIsPending(true);
    try {
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

      const proofArg = proofs.map(
        (p) => {
          const bu = Buffer.from(p.slice(2), 'hex')
          return Array.from(bu);
        }
      );

      const txHash = await chain_work_bench_program.methods.claim(
          new BN(eventsData.claim_version),
          new BN(amount),
          proofArg
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
      setIsPending(false)
      setError(e)
      console.log(e);
      console.error('solana claim, error', e)
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
