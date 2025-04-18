"use client";

import { EventContent } from "./event-content";
import { CoinList } from "./coin-list";
import { BreadCrumbs } from "@/components/bread-crumbs";
import { IClaimToken, useClaimTokens } from "@/lib/api/use-claim-tokens";
import { useEffect, useState } from "react";
import { GoBackTo } from "@/components/go-back-to";
import { ActivationTypeEvent } from "./activation-type-event";
export default function EventsPage() {
  const { data: claimTokensData } = useClaimTokens();
  const { claimTokens, claimChunkArray: claimArray } = claimTokensData || {
    claimTokens: [],
    claimChunkArray: [],
  };

  const [currentToken, setCurrentToken] = useState(claimTokens[0]);

  useEffect(() => {
    if (claimTokens?.length) {
      setCurrentToken(claimTokens[0]);
    }
  }, [claimTokens]);

  function handleClickToken(t: IClaimToken) {
    if (!t) return;
    setCurrentToken(t);
  }

  return (
    <div className="content-w-560">
      <div className="relative flex flex-row-reverse items-end justify-between sm:flex-row">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <div>
        <div className="relative mt-6 flex w-full flex-col-reverse sm:flex-row sm:justify-between">
          <CoinList
            claimArray={claimArray}
            currentToken={currentToken}
            onClick={handleClickToken}
          />
          <div className="bg-blur12 flex h-[256px] w-full flex-col items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.1)] sm:h-[320px] sm:w-[480px]">
            {currentToken?.claim_type === "activation_code" ? (
              <ActivationTypeEvent eventInfo={currentToken} />
            ) : (
              <EventContent currentToken={currentToken} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
