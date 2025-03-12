import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import BN from "bn.js";
import { useSolProgram } from "./use-sol-program";
import { useState } from "react";
import { IClaimToken } from "./api/use-claim-tokens";
import { IClaimData } from "./use-claim-data";
import { useFetchUserInfo } from "./api/use-fetch-user-info";
import { getWorkBenchAddress } from "./contract/contract-address";
import { SolanaChainInfos } from "@/lib/const/chain";

export function useSolClaim(currentToken: IClaimToken | undefined) {
  const { data: userInfo } = useFetchUserInfo();

  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<any>();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>();

  const { publicKey: authority } = useWallet();

  const ProgramAddress = getWorkBenchAddress(SolanaChainInfos.Solana.name);
  const chain_work_bench_program = useSolProgram(ProgramAddress);

  const systemProgram = anchor.web3.SystemProgram.programId;
  const tokenProgram = TOKEN_PROGRAM_ID;
  const associatedTokenProgram = ASSOCIATED_TOKEN_PROGRAM_ID;

  const systemConfig = PublicKey.findProgramAddressSync(
    [Buffer.from("system_config")],
    chain_work_bench_program.programId,
  )[0];

  async function getTokenAccounts(tokenAddress: string) {
    const tokenMint = new PublicKey(tokenAddress);

    const poolTokenAuthority = PublicKey.findProgramAddressSync(
      [systemConfig.toBuffer()],
      chain_work_bench_program.programId,
    )[0];

    const poolTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      poolTokenAuthority,
      true,
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      authority!,
      true,
    );

    return {
      tokenMint,
      poolTokenAuthority,
      poolTokenAccount,
      userTokenAccount,
    };
  }

  function getProofArg(proofs: string[]) {
    return proofs.map((p) => {
      const bu = Buffer.from(p.slice(2), "hex");
      return Array.from(bu);
    });
  }

  function getRecipientAccounts(recipients: string[]) {
    return recipients.map((r) => {
      return new PublicKey(r);
    });
  }

  async function claimAction(claimData: IClaimData) {
    const amount = claimData.claim_amount;
    const proofs = claimData.proofs;
    const recipients = claimData.recipients;

    setIsPending(true);
    try {
      const eventsData = currentToken?.eventData;
      if (!eventsData) return;

      const claim_version_buf = Buffer.alloc(8);
      claim_version_buf.writeUint32LE(eventsData.claim_version);

      const uid = userInfo?.uid;
      const uidBuf = Buffer.alloc(8);
      uidBuf.writeUint32LE(uid);

      const claimConfig = PublicKey.findProgramAddressSync(
        [Buffer.from("claim_config"), claim_version_buf, uidBuf],
        chain_work_bench_program.programId,
      )[0];

      const {
        poolTokenAuthority,
        poolTokenAccount,
        userTokenAccount,
        tokenMint,
      } = await getTokenAccounts(eventsData.token_address);

      const proofArg = getProofArg(proofs);

      const recipientAccounts = getRecipientAccounts(recipients);

      const txHash = await chain_work_bench_program.methods
        .claim(
          new BN(uid),
          recipientAccounts,
          new BN(eventsData.claim_version),
          new BN(amount),
          proofArg,
        )
        .accounts({
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
          systemProgram,
        })
        .signers([])
        .rpc();

      setIsPending(false);
      setIsSuccess(true);
      setData(txHash);

      return txHash;
    } catch (e) {
      setIsError(true);
      setIsPending(false);
      setError(e);
      console.log(e);
      console.error("solana claim, error", e);
      return error;
    }
  }

  return {
    isPending,
    isSuccess,
    isError,
    error,
    data,
    claimAction,
  };
}
