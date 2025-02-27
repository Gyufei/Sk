import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import BN from "bn.js";
import { useSolProgram } from "./use-sol-program";
import { useState } from "react";
import { useFetchUserInfo } from "./api/use-fetch-user-info";
import { IPayToken } from "@/app/[local]/mart/pay-config";
import { useRecipients } from "./api/use-recipient";

export function useSolPay(token: IPayToken) {
  const { data: userInfo } = useFetchUserInfo();
  const { connection } = useConnection();
  const { publicKey: authority, sendTransaction } = useWallet();
  const { data: recipients } = useRecipients();

  const chain_work_bench_program = useSolProgram();

  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<any>();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>();

  const systemProgram = anchor.web3.SystemProgram.programId;
  const tokenProgram = TOKEN_PROGRAM_ID;
  const associatedTokenProgram = ASSOCIATED_TOKEN_PROGRAM_ID;
  const systemConfig = PublicKey.findProgramAddressSync(
    [Buffer.from("system_config")],
    chain_work_bench_program.programId,
  )[0];

  async function getSolTokenAccounts(tokenAddress: string) {
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

  async function getStableTokenAccounts(
    tokenAddress: string,
    recipient: string,
  ) {
    const tokenMint = new PublicKey(tokenAddress);
    const recipientPublicKey = new PublicKey(recipient);

    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      authority!,
    );

    const recipientTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      recipientPublicKey,
    );

    return {
      tokenMint,
      recipientPublicKey,
      userTokenAccount,
      recipientTokenAccount,
    };
  }

  function getRecipientAccounts(recs: string[]) {
    return recs.map((r) => {
      return new PublicKey(r);
    });
  }

  async function payAction(payInfo: Record<string, any>) {
    setIsPending(true);
    try {
      let txHash = "";
      if (token.isStable) {
        txHash = await payWithStable(payInfo);
      } else {
        txHash = await payWithSol(payInfo);
      }

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
    } finally {
      setIsPending(false);
    }
  }

  async function payWithStable(payInfo: Record<string, any>) {
    const amount = payInfo.product_price;
    const recipient = recipients?.solana?.address;

    if (!recipient) {
      console.error("solana recipient is not found");
      return "";
    }

    const { userTokenAccount, recipientTokenAccount } =
      await getStableTokenAccounts(token.address, recipient);

    const transaction = new Transaction().add(
      createTransferInstruction(
        userTokenAccount,
        recipientTokenAccount,
        authority!,
        parseFloat(amount) * Math.pow(10, token.decimals),
      ),
    );

    const txHash = await sendTransaction(transaction, connection);

    return txHash || "";
  }

  async function payWithSol(payInfo: Record<string, any>) {
    const amount = payInfo.claim_amount;
    const recipient = recipients?.solana?.address;

    if (!recipient) {
      return "";
    }

    const eventsData = payInfo?.eventData;
    if (!eventsData) return "";

    const uid = userInfo?.uid;
    const uidBuf = Buffer.alloc(8);
    uidBuf.writeUint32LE(uid);

    const {
      poolTokenAuthority,
      poolTokenAccount,
      userTokenAccount,
      tokenMint,
    } = await getSolTokenAccounts(token.address);

    const recipientAccounts = getRecipientAccounts([recipient]);

    const txHash = await chain_work_bench_program.methods
      .claim(
        new BN(uid),
        recipientAccounts,
        new BN(eventsData.claim_version),
        new BN(amount),
      )
      .accounts({
        authority,
        recipient: authority,
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

    return txHash || "";
  }

  return {
    isPending,
    isSuccess,
    isError,
    error,
    data,
    payAction,
  };
}
