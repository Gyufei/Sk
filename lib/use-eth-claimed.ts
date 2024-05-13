import { useAccount, useContractRead } from "wagmi";
import { ChainWorkBenchABI } from "./contract/eth/ChainWorkBench";
import { useContractAddress } from "./contract/use-contract-address";
import { encodeAbiParameters, keccak256, parseAbiParameters } from "viem";

export function useEthClaimed(isEthereum: boolean, eventsData: Record<'claim_version' | 'token_address', any>, amount: number) {
  const { address } = useAccount();
  const ContractAddress = useContractAddress("ethereum");

  const leaf = eventsData && amount ? keccak256(encodeAbiParameters(
    parseAbiParameters('address x, address y, uint256 z, uint256 k'),
    [address!, eventsData?.token_address, amount as any, eventsData?.claim_version])) : ''

  const res = useContractRead({
    address: ContractAddress as `0x${string}`,
    abi: ChainWorkBenchABI.abi,
    functionName: 'claimed',
    args: [leaf]
  })

  const isClaimed = (res?.data as any);

  return {
    ...res,
    data: {
      claimed: isClaimed
    }
  }
}
