import { useAccount, useReadContract } from "wagmi";
import { ChainWorkBenchABI } from "./contract/eth/ChainWorkBench";
import { ChainWorkBenchABIV2 } from "./contract/eth/ChainWorkBench-v2";
import { useContractAddress } from "./contract/use-contract-address";
import { encodeAbiParameters, keccak256, parseAbiParameters } from "viem";
import { useAtomValue } from "jotai";
import { UuidAtom } from "./api/state";
import { IClaimToken } from "./api/use-claim-tokens";

export function useCheckEthClaimed(
  currentToken: IClaimToken | undefined,
  amount: number | null,
) {
  const Uuid = useAtomValue(UuidAtom);
  const { address } = useAccount();

  const isEvm = currentToken?.chainInfo.isEVM;
  const eventsData = currentToken?.eventData;
  const isV2 = eventsData?.version === "v2";

  const chainName = currentToken?.chainInfo?.name?.toLowerCase() as any;

  const { address: ContractAddress } = useContractAddress(
    chainName || "ethereum",
    isV2,
  );

  const leaf =
    eventsData && amount && isEvm
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
    abi: isV2 ? ChainWorkBenchABIV2 : ChainWorkBenchABI,
    functionName: "claimed",
    args: [leaf],
    query: {
      enabled: !!leaf,
    },
  });

  console.log("123", res?.data);

  const isClaimed = res?.data as any;

  return {
    ...res,
    data: {
      claimed: isClaimed,
    },
  };
}
