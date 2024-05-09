// import * as anchor from "@coral-xyz/anchor";
// import { PublicKey } from "@solana/web3.js";
// import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { ChainWorkBenchABI } from "@/lib/abi/ChainWorkBench";
// import {
//   ASSOCIATED_TOKEN_PROGRAM_ID,
//   TOKEN_PROGRAM_ID,
//   getAssociatedTokenAddress,
// } from "@solana/spl-token";
// import BN from 'bn.js';

// const ProgramAddress = '';

export function useSolClaim() {
  // const wallet = useAnchorWallet();
  // const { connection } = useConnection();
  // const provider = new anchor.AnchorProvider(
  //   connection,
  //   wallet!,
  //   anchor.AnchorProvider.defaultOptions(),
  // );
  // anchor.setProvider(provider);

  // const { publicKey: authority } = useWallet();

  // const programId = new PublicKey(
  //   ProgramAddress
  // );
  // const chain_work_bench_program = new anchor.Program(
  //   ChainWorkBenchABI as any,
  //   programId,
  //   provider,
  // );

  // const systemProgram = anchor.web3.SystemProgram.programId;
  // const tokenProgram = TOKEN_PROGRAM_ID;
  // const associatedTokenProgram = ASSOCIATED_TOKEN_PROGRAM_ID;

  // const systemConfig = PublicKey.findProgramAddressSync(
  //     [
  //         Buffer.from("system_config")
  //     ],
  //     chain_work_bench_program.programId
  // )[0];

  // const proof = getMerkleHexProof(
  //     authority!.toBase58(),
  //     "2000.1",
  //     user_data
  // );
  // const claim_version = user_data.claim_version;
  // const claim_version_buf = Buffer.alloc(8);
  // claim_version_buf.writeUint32LE(claim_version);
  // const claimConfig = PublicKey.findProgramAddressSync(
  //     [
  //         Buffer.from("claim_config"),
  //         claim_version_buf,
  //         authority!.toBuffer()
  //     ],
  //     chain_work_bench_program.programId
  // )[0];
  // const tokenMint = new PublicKey(user_data.token_address);

  // const writeAction = async () => {
  //   const poolTokenAuthority = PublicKey.findProgramAddressSync(
  //       [
  //           systemConfig.toBuffer()
  //       ],
  //       chain_work_bench_program.programId
  //   )[0];

  //   const poolTokenAccount = await getAssociatedTokenAddress(
  //       tokenMint,
  //       poolTokenAuthority,
  //       true
  //   );

  //   const userTokenAccount = await getAssociatedTokenAddress(
  //       tokenMint,
  //       authority!,
  //       true
  //   );

  //   const txHash = await chain_work_bench_program.methods.claim(
  //       new BN(claim_version),
  //       new BN(2000100000000),
  //       proof
  //   ).accounts({
  //       authority,
  //       recipient: authority,
  //       claimConfig,
  //       systemConfig,
  //       poolTokenAuthority,
  //       poolTokenAccount,
  //       userTokenAccount,
  //       tokenMint,
  //       tokenProgram,
  //       associatedTokenProgram,
  //       systemProgram
  //   }).signers([]).rpc();

  //   return txHash;
  // };


  // return {
  //   writeAction
  // };
}
