"use client";

import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ChainInfos } from "@/lib/const";
import { useEthClaim } from "@/lib/use-eth-claim";

interface IClaimToken {
  name: string;
  logo: string;
  chainInfo: (typeof ChainInfos)[keyof typeof ChainInfos];
  amount: number;
}

const ClaimTokens: IClaimToken[] = [
  {
    name: "FOXY",
    logo: "/images/coin/fox.png",
    chainInfo: ChainInfos["Ethereum"],
    amount: 3000200000,
  },
  {
    name: "pepe",
    logo: "/images/coin/pepe.png",
    chainInfo: ChainInfos["Ethereum"],
    amount: 0,
  },
];

export default function EventsPage() {
  const { publicKey } = useWallet();
  const { setVisible: setSolanaModalVisible } = useWalletModal();

  const [currentToken, setCurrentToken] = useState(ClaimTokens[0]);

  const { claimAction, isPending } = useEthClaim();

  function handleClaim() {
    if (currentToken.chainInfo.isEVM) {
      claimEvm();
      return;
    }

    if (currentToken.chainInfo.name === "Solana") {
      claimSolana();
    }
  }

  const solanaAddress = useMemo(
    () => (publicKey ? publicKey.toBase58() : ""),
    [publicKey],
  );

  async function claimEvm() {
    if (isPending) return;
    claimAction(currentToken.amount);
  }

  async function claimSolana() {
    if (!solanaAddress) {
      setSolanaModalVisible(true);
    } else {
      return;
    }
  }

  function handleClickToken(t: IClaimToken) {
    setCurrentToken(t);
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent
        showOverlay={false}
        showClose={false}
        className="flex w-[345px] flex-col rounded-3xl border-none bg-[rgba(255,255,255,0.1)] p-0 backdrop-blur-[7px] md:w-[469px]"
      >
        <div className="relative flex w-full flex-col items-center p-[35px]">
          <div className="absolute -bottom-[80px] left-0 flex h-auto w-full flex-row justify-between md:-left-[80px] md:top-0 md:h-full md:w-auto md:flex-col">
            <CoinItem
              onClick={() => handleClickToken(ClaimTokens[0])}
              src={ClaimTokens[0].logo}
            />
            <CoinItem
              onClick={() => handleClickToken(ClaimTokens[1])}
              src={ClaimTokens[1].logo}
            />
            <CoinItem onClick={() => {}} src="" />
            <CoinItem onClick={() => {}} src="" />
          </div>
          {currentToken.amount ? (
            <>
              <div className="text-[28px] font-medium leading-9 text-white">
                <span className="opacity-60">You&apos;re </span>
                <span className="opacity-80">eligible!</span>
              </div>
              <div className="mt-4 flex items-center gap-x-[10px]">
                <div className="text-[36px] font-semibold leading-[54px] text-white">
                  {currentToken.amount}
                </div>
                <div className="flex h-10 items-center rounded-lg bg-[rgba(255,255,255,0.5)] px-3 py-[2px] text-[20px] font-semibold leading-[30px] text-[#262626] outline-none">
                  ${currentToken.name}
                </div>
              </div>
              <div className="mt-1 flex items-center text-base font-medium leading-6 text-white opacity-60">
                <div>on</div>
                <Image
                  src={currentToken.chainInfo.logo}
                  width={16}
                  height={16}
                  alt="sol net"
                  className="ml-2 mr-1"
                />
                <div>{currentToken.chainInfo.name}</div>
              </div>
              <div
                onClick={handleClaim}
                className="mt-5 box-border flex h-12 w-[240px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(255,255,255,0.01)] opacity-60 hover:opacity-70"
              >
                <div className="text-base leading-6 text-white">
                  {isPending ? "Claiming" : "Claim"}
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-[202px] flex-col items-center justify-center">
              <div className="text-[40px] leading-9 text-white opacity-80">
                Sorry!
              </div>
              <div className="mt-[10px] text-[28px] font-medium leading-9 text-white">
                <span className="opacity-60">You&apos;re </span>
                <span className="opacity-80">not eligible!</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CoinItem({ src, onClick }: { src: string; onClick: () => void }) {
  function handleClick() {
    if (src) onClick();
  }

  return (
    <div
      onClick={handleClick}
      className="flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-xl bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]"
    >
      {src && (
        <Image
          src={src}
          width={40}
          height={40}
          className="rounded-full"
          alt="coin"
        />
      )}
    </div>
  );
}
