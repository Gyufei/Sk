import { useAccount, useReadContract } from "wagmi";
import { ChainWorkBenchABI } from "./contract/eth/ChainWorkBench";
import { useContractAddress } from "./contract/use-contract-address";
import { encodeAbiParameters, keccak256, parseAbiParameters } from "viem";
import { useAtomValue } from "jotai";
import { UuidAtom } from "./api/state";

export function useCheckEthClaimed(
  isEthereum: boolean,
  chainName: "linea" | "ethereum" | "op",
  eventsData: Record<"claim_version" | "token_address" | "version", any>,
  amount: number | null,
) {
  const Uuid = useAtomValue(UuidAtom);
  const { address } = useAccount();
  const isV2 = eventsData?.version === "v2";

  const chainNameVersion =
    isV2 && chainName === "ethereum" ? "ethereum-v2" : chainName;
  const { address: ContractAddress } = useContractAddress(chainNameVersion);

  const leaf =
    eventsData && amount && isEthereum
      ? keccak256(
          encodeAbiParameters(
            isV2
              ? parseAbiParameters("unit256 x, address y, uint256 z, uint256 k")
              : parseAbiParameters(
                  "address x, address y, uint256 z, uint256 k",
                ),
            [
              isV2 ? Uuid : address!,
              eventsData?.token_address,
              amount as any,
              eventsData?.claim_version,
            ],
          ),
        )
      : "";

  const res = useReadContract({
    address: ContractAddress as `0x${string}`,
    abi: ChainWorkBenchABI.abi,
    functionName: "claimed",
    args: [leaf],
  });

  const isClaimed = res?.data as any;

  return {
    ...res,
    data: {
      claimed: isClaimed,
    },
  };
}
