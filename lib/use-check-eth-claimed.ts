import { useAccount, useReadContract } from "wagmi";
import { ChainWorkBenchABI } from "./contract/eth/ChainWorkBench";
import { ChainWorkBenchABIV2 } from "./contract/eth/ChainWorkBench-v2";
import { getWorkBenchAddress } from "./contract/contract-address";
import { encodeAbiParameters, keccak256, parseAbiParameters } from "viem";
import { IClaimToken } from "./api/use-claim-tokens";
import { useFetchUserInfo } from "./api/use-fetch-user-info";

export function useCheckEthClaimed(
  currentToken: IClaimToken | undefined,
  amount: number | null,
) {
  const { data: userInfo } = useFetchUserInfo();
  const uid = userInfo?.uid;
  const { address } = useAccount();

  const isEvm = currentToken?.chainInfo.isEVM;
  const eventsData = currentToken?.eventData;
  const isV2 = eventsData?.version === "v2";

  const chainName = currentToken?.chainInfo?.name?.toLowerCase() as any;

  const ContractAddress = getWorkBenchAddress(chainName || "ethereum", isV2);

  const leaf =
    eventsData && amount && isEvm
      ? keccak256(
          encodeAbiParameters(
            isV2
              ? parseAbiParameters("uint256 x, address y, uint256 z, uint256 k")
              : parseAbiParameters(
                  "address x, address y, uint256 z, uint256 k",
                ),
            [
              isV2 ? (uid as any) : address!,
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
    args: isV2 ? [eventsData?.claim_version, uid] : [leaf],
    query: {
      enabled: isEvm && eventsData && uid && amount && !currentToken?.isCutOff,
    },
  });

  const isClaimed = res?.data as any;

  return {
    ...res,
    data: {
      claimed: isClaimed,
    },
  };
}
