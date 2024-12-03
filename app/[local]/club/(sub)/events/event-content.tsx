
import { useTranslations } from "next-intl";
import { IClaimToken } from "@/lib/api/use-claim-tokens";
import { ChainLogoText } from "./chain-logo-text";

export function EventContent({
  currentToken,
  currentAddress,
  claimData,
  claimAmount,
  showClaimAmount,
  isClaimed,
  isPending,
  handleConnect,
  handleClaim
}: {
  currentToken: IClaimToken | undefined;
  currentAddress: string | undefined;
  claimData: any;
  claimAmount: number | undefined;
  showClaimAmount: number;
  isClaimed: boolean;
  isPending: boolean | undefined;
  handleConnect: () => void;
  handleClaim: () => void;
}) {
  const T = useTranslations("Common");
  const isOffChain = !!(currentToken?.chainInfo as any)?.isOffChain;


  if (!currentToken) {
    return (
      <div className="h-[208px]"></div>
    )
  }

  if (!currentAddress) {
    return (
      <div className="flex h-[208px] flex-col items-center justify-center">
        <div
          data-disabled={false}
          onClick={handleConnect}
          className="mt-5 box-border flex h-12 w-[240px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(255,255,255,0.01)] opacity-60 hover:opacity-70 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=true]:hover:opacity-50"
        >
          <div className="flex justify-between text-base leading-6 text-white">
            <span>Connect</span>
            {currentToken && (
              <ChainLogoText
                logo={
                  isOffChain
                    ? "/icons/network/ethereum.svg"
                    : currentToken.chainInfo.logo
                }
                name={isOffChain ? "EVM" : currentToken.chainInfo.name}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!claimData) {
    return (
      <div className="flex h-[208px] flex-col items-center justify-center"></div>
    )
  }

  if (!claimAmount || claimAmount === 0) {
    return (
      <div className="flex h-[208px] flex-col items-center justify-center">
        <div className="text-[40px] leading-9 text-white opacity-80">
          {T("Sorry")}
        </div>
        <div className="mt-[10px] text-center text-[28px] font-medium leading-9 text-white">
          <span className="opacity-60">{T("YouAre")}</span>
          <span className="opacity-80">{T("NotEligible")}</span>
        </div>
      </div>
    )
  }
  
  return (
    <>
      <div className="text-[28px] font-medium leading-9 text-white">
        <span className="opacity-60">{T("YouAre")}</span>
        <span className="opacity-80">{T("Eligible")}</span>
      </div>
      <div className="mt-4 flex items-center gap-x-[10px]">
        <div className="text-[36px] font-semibold leading-[54px] text-white">
          {showClaimAmount}
        </div>
        <div className="flex h-10 items-center rounded-lg bg-[rgba(255,255,255,0.5)] px-3 py-[2px] text-[20px] font-semibold leading-[30px] text-[#262626] outline-none">
          {!isOffChain ? "$" : ""}
          {currentToken.symbol}
        </div>
      </div>
      <div
        style={{ visibility: isOffChain ? "hidden" : "visible" }}
        className="mt-1 flex items-center text-base font-medium leading-6 text-white opacity-60"
      >
        <div>{T("On")}</div>
        <ChainLogoText
          logo={currentToken.chainInfo.logo}
          name={currentToken.chainInfo.name}
        />
      </div>
      {
        <div
          data-not={isClaimed || isPending || currentToken.isCutOff}
          onClick={handleClaim}
          className="mb-[6px] mt-5 box-border flex h-12 w-[240px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(255,255,255,0.01)] opacity-60 hover:opacity-70 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=true]:hover:opacity-50"
        >
          <div className="flex justify-between text-base leading-6 text-white">
            {isClaimed ? (
              T("Claimed")
            ) : currentToken.isCutOff ? (
              T("Unavailable")
            ) : isPending ? (
              T("Claiming")
            ) : (
              <>
                <span className="font-bold">{T("Claim")}</span>
                {!currentToken.chainInfo.isOffChain && (
                  <div
                    style={{
                      visibility: isOffChain ? "hidden" : "visible",
                    }}
                    className="ml-1 flex justify-start"
                  >
                    <span>{T("On")}</span>
                    <ChainLogoText
                      logo={currentToken.chainInfo.logo}
                      name={currentToken.chainInfo.name}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      }
    </>
  )
}

