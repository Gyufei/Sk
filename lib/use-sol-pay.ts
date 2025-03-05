import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { useSolProgram } from "./use-sol-program";
import { useState } from "react";
import { IPayToken, payTokenConfig } from "@/app/[local]/mart/pay-config";
import { useRecipients } from "./api/use-recipient";
import { ChainInfos, IChain, SolanaChainInfos } from "./const";
import NP from "number-precision";
import { isProduction } from "./api/path";
import { useTokenPrice } from "./api/use-token-price";
import { IOrderInfo } from "./api/use-create-order";

export function useSolPay(chain: IChain, token: IPayToken) {
  const isSolana = chain.name === SolanaChainInfos.Solana.name;

  const { publicKey: authority } = useWallet();
  const { data: solPriceData } = useTokenPrice("SOL", isSolana);
  const { data: recipientData } = useRecipients(
    ChainInfos.Solana.name,
    token.name,
    isSolana,
  );

  const chain_work_bench_program = useSolProgram();

  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<any>();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>();

  const recipient = recipientData?.deposit_address;

  const systemProgram = anchor.web3.SystemProgram.programId;
  const tokenProgram = TOKEN_PROGRAM_ID;
  const associatedTokenProgram = ASSOCIATED_TOKEN_PROGRAM_ID;

  async function payWithStable(orderInfo: IOrderInfo) {
    const payPrice = orderInfo.product_price;
    const payAmount = new anchor.BN(
      Math.floor(NP.times(payPrice, 10 ** token.decimals)),
    );

    if (!recipient) {
      console.error("solana recipient is not found");
      return "";
    }

    const {
      tokenMint,
      recipientPublicKey,
      userTokenAccount,
      recipientTokenAccount,
    } = await getStableTokenAccounts(token.address, recipient, authority!);

    const txHash = await chain_work_bench_program.methods
      .transferStableToken(payAmount)
      .accounts({
        user: authority!,
        receiveAccount: recipientPublicKey,
        userTokenAccount: userTokenAccount,
        receiveTokenAccount: recipientTokenAccount,
        tokenMint,
        tokenProgram,
        associatedTokenProgram,
        systemProgram,
      })
      .signers([])
      .rpc();

    return txHash || "";
  }

  async function payWithSol(orderInfo: IOrderInfo) {
    if (!recipient) {
      console.error("recipient data is not found");
      return "";
    }

    const { sol, usdc } = getToken();

    const payPrice = orderInfo.product_price;
    const usdcAmount = new anchor.BN(
      Math.floor(NP.times(payPrice, 10 ** usdc!.decimals)),
    );

    if (!solPriceData) {
      console.error("sol price data is not found");
      return "";
    }

    const solPrice = solPriceData?.price;
    const solAmount = new anchor.BN(
      Math.floor(NP.times(NP.divide(payPrice, solPrice), 10 ** sol!.decimals)),
    );

    const {
      recipientPublicKey,
      solMint,
      usdcMint,
      usdcTokenAccount,
      solTmpTokenAccount,
      raydiumProgram,
      amm,
      ammAuthority,
      ammOpenOrders,
      poolCoinTokenAccount,
      poolPcTokenAccount,
      serumProgram,
      serumMarket,
      serumBids,
      serumAsks,
      serumEventQueue,
      serumCoinVaultAccount,
      serumPcVaultAccount,
      serumVaultSigner,
    } = await getSolTokenAccounts(recipient, authority!);

    const txHash = await chain_work_bench_program.methods
      .swapSolToUsdc(solAmount, usdcAmount)
      .accounts({
        user: authority!,
        receiveAccount: recipientPublicKey,
        wsolMint: solMint,
        wsolAccount: solTmpTokenAccount,
        receiveUsdcAccount: usdcTokenAccount,
        usdcMint: usdcMint,
        raydiumProgram,
        systemProgram,
        tokenProgram,
        associatedTokenProgram,
      })
      .remainingAccounts([
        {
          pubkey: amm,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: ammAuthority,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: ammOpenOrders,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: poolCoinTokenAccount,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: poolPcTokenAccount,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: serumProgram,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: serumMarket,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: serumBids,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: serumAsks,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: serumEventQueue,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: serumCoinVaultAccount,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: serumPcVaultAccount,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: serumVaultSigner,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: solTmpTokenAccount,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: usdcTokenAccount,
          isSigner: false,
          isWritable: true,
        },
      ])
      .signers([])
      .rpc();

    return txHash || "";
  }

  async function payAction(orderInfo: IOrderInfo) {
    setIsPending(true);
    try {
      let txHash = "";
      if (token.isStable) {
        txHash = await payWithStable(orderInfo);
      } else {
        txHash = await payWithSol(orderInfo);
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

  function reset() {
    setIsPending(false);
    setIsSuccess(false);
    setData(undefined);
    setIsError(false);
    setError(undefined);
  }

  return {
    isPending,
    isSuccess,
    isError,
    error,
    data,
    payAction,
    reset,
  };
}

async function getStableTokenAccounts(
  tokenAddress: string,
  recipient: string,
  authority: PublicKey,
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

async function getSolTokenAccounts(
  recipientAddr: string,
  authority: PublicKey,
) {
  const recipientPublicKey = new PublicKey(recipientAddr);
  const { sol, usdc } = getToken();

  const solMint = new PublicKey(sol!.address);
  const usdcMint = new PublicKey(usdc!.address);

  const usdcTokenAccount = await getAssociatedTokenAddress(
    usdcMint,
    recipientPublicKey,
  );

  console.log("usdcTokenAccount", usdcTokenAccount);
  const solTmpTokenAccount = PublicKey.findProgramAddressSync(
    [Buffer.from("tmp_wsol_account"), authority.toBuffer()],
    new PublicKey("8cEDB35SwfpVdD7hrppxN27V46UKowRTHTtwuXgqo3w6"),
  )[0];
  console.log("solTmpTokenAccount", solTmpTokenAccount);

  let raydiumProgram: PublicKey;
  let amm: PublicKey;
  let ammAuthority: PublicKey;
  let ammOpenOrders: PublicKey;
  let poolCoinTokenAccount: PublicKey;
  let poolPcTokenAccount: PublicKey;
  let serumProgram: PublicKey;
  let serumMarket: PublicKey;
  let serumBids: PublicKey;
  let serumAsks: PublicKey;
  let serumEventQueue: PublicKey;
  let serumCoinVaultAccount: PublicKey;
  let serumPcVaultAccount: PublicKey;
  let serumVaultSigner: PublicKey;

  if (!isProduction) {
    raydiumProgram = new PublicKey(
      "HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8",
    );
    amm = new PublicKey("68izSmqf5PumfBm4uLhpWj1KfimFFMRy2iF8XZnychv9");
    ammAuthority = new PublicKey(
      "DbQqP6ehDYmeYjcBaMRuA8tAJY1EjDUz9DpwSLjaQqfC",
    );
    ammOpenOrders = new PublicKey(
      "85gR95XwkzmJtapPQaRfd3NrmgREyGXR13AWJXGgaYFL",
    );
    poolCoinTokenAccount = new PublicKey(
      "GV2f4g1NKKX9KK7ea9dhh99z9tv9Ctn6pEJdLCAaB3jJ",
    );
    poolPcTokenAccount = new PublicKey(
      "6Nro3V2CrXCouqQde5mQnpdSW6YxM3CV4hpBVB3k44YH",
    );

    serumProgram = new PublicKey(
      "EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj",
    );
    serumMarket = new PublicKey("EsY8tzNqrAw4mMrvXc2yBenHzr1e25q66Dt5b9foJjoW");
    serumBids = new PublicKey("DWjgRhAt8bQ91uz9H5UDNs2w9pvZ86bN5vyZyy7SzqD6");
    serumAsks = new PublicKey("FKWJHwtxBWaFKLVKF1k5WZwjcmyjyZiZ94LeJnh2GukV");

    serumEventQueue = new PublicKey(
      "89GtBfk8quDPdkAsXaB6En2h8myyhtA2KQtzJ898mdaX",
    );
    serumCoinVaultAccount = new PublicKey(
      "D8mKKKbmxvS6qCdmdZgEgBhF1miXcvdnhMmPrd4Seh7Z",
    );
    serumPcVaultAccount = new PublicKey(
      "DpsFAywJKUVMugscRi2VPvdH8EM2QQw8YhWKjUBqpqW2",
    );
    serumVaultSigner = new PublicKey(
      "CAzoJHgKGEx46VJmsKueyWGze5fqwCCRFYqJ1US76tgs",
    );
  } else {
    raydiumProgram = new PublicKey(
      "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
    );

    amm = new PublicKey("58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2");
    ammAuthority = new PublicKey(
      "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
    );
    ammOpenOrders = new PublicKey(
      "HmiHHzq4Fym9e1D4qzLS6LDDM3tNsCTBPDWHTLZ763jY",
    );
    poolCoinTokenAccount = new PublicKey(
      "DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz",
    );
    poolPcTokenAccount = new PublicKey(
      "HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz",
    );

    serumProgram = new PublicKey("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX");
    serumMarket = new PublicKey("8BnEgHoWFysVcuFFX7QztDmzuH8r5ZFvyP3sYwn1XTh6");
    serumBids = new PublicKey("5jWUncPNBMZJ3sTHKmMLszypVkoRK6bfEQMQUHweeQnh");
    serumAsks = new PublicKey("EaXdHx7x3mdGA38j5RSmKYSXMzAFzzUXCLNBEDXDn1d5");

    serumEventQueue = new PublicKey(
      "8CvwxZ9Db6XbLD46NZwwmVDZZRDy7eydFcAGkXKh9axa",
    );
    serumCoinVaultAccount = new PublicKey(
      "CKxTHwM9fPMRRvZmFnFoqKNd9pQR21c5Aq9bh5h9oghX",
    );
    serumPcVaultAccount = new PublicKey(
      "6A5NHCj1yF6urc9wZNe6Bcjj4LVszQNj5DwAWG97yzMu",
    );
    serumVaultSigner = new PublicKey(
      "AnghRBPS9ERJqDihf7SMbFvwMoRqTBpiYiNjTcByCjop",
    );
  }

  return {
    recipientPublicKey,
    solMint,
    usdcMint,
    usdcTokenAccount,
    solTmpTokenAccount,
    raydiumProgram,
    amm,
    ammAuthority,
    ammOpenOrders,
    poolCoinTokenAccount,
    poolPcTokenAccount,
    serumProgram,
    serumMarket,
    serumBids,
    serumAsks,
    serumEventQueue,
    serumCoinVaultAccount,
    serumPcVaultAccount,
    serumVaultSigner,
  };
}

function getToken() {
  const sol = payTokenConfig[SolanaChainInfos.Solana.name].find(
    (t) => t.name === "SOL",
  );

  const usdc = payTokenConfig[SolanaChainInfos.Solana.name].find(
    (t) => t.name === "USDC",
  );

  return {
    sol,
    usdc,
  };
}
