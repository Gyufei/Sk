import { useWriteContract } from "wagmi";
import { ChainName, useContractAddress } from "./contract/use-contract-address";
import { ChainWorkBenchABI } from "./contract/eth/ChainWorkBench";
import { ChainWorkBenchABIV2 } from "./contract/eth/ChainWorkBench-v2";
import { IClaimToken } from "./api/use-claim-tokens";
import { IClaimData } from "./use-claim-data";

export function useEthClaim(currentToken: IClaimToken | undefined) {
  const chainName =
    (currentToken?.chainInfo?.name?.toLowerCase() as ChainName) || "ethereum";
  const isV2 = currentToken?.eventData?.version === "v2";

  const { address: ContractAddress } = useContractAddress(chainName, isV2);

  const {
    writeContract,
    data,
    isPending: isLoading,
    isError,
    isSuccess,
    error,
  } = useWriteContract();

  function claimActionV1(claimData: IClaimData) {
    writeContract({
      address: ContractAddress as `0x${string}`,
      abi: ChainWorkBenchABI,
      functionName: "claim",
      args: [claimData.claim_amount || 0, claimData.proofs],
    });
  }

  function claimActionV2(claimData: IClaimData) {
    writeContract({
      address: ContractAddress as `0x${string}`,
      abi: ChainWorkBenchABIV2,
      functionName: "claim",
      args: [
        claimData.uid,
        claimData.claim_amount,
        claimData.recipients,
        claimData.proofs,
      ],
    });
  }

  if (error) {
    console.log(error);
  }

  return {
    data,
    claimAction: isV2 ? claimActionV2 : claimActionV1,
    isPending: isLoading,
    isError,
    isSuccess,
  };
}
