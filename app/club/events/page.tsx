"use client";

import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function EventsPage() {
  const { publicKey } = useWallet();
  const { setVisible: setSolanaModalVisible } = useWalletModal();

  function handleClaim() {
    claimSolana();
  }

  const solanaAddress = useMemo(
    () => (publicKey ? publicKey.toBase58() : ""),
    [publicKey],
  );

  async function claimSolana() {
    if (!solanaAddress) {
      setSolanaModalVisible(true);
    } else {
      return;
    }
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
            <CoinItem src="/images/coin/pepe.png" />
            <CoinItem src="/images/coin/fox.png" />
            <CoinItem src="" />
            <CoinItem src="" />
          </div>
          <div className="text-[28px] font-medium leading-9 text-white opacity-80">
            You&apos;re eligible!
          </div>
          <div className="mt-4 flex items-center gap-x-[10px]">
            <div className="text-[36px] font-semibold leading-[54px] text-white">
              3000
            </div>
            <div className="flex h-10 items-center rounded-lg bg-[rgba(255,255,255,0.5)] px-3 py-[2px] text-[20px] font-semibold leading-[30px] text-[#262626] outline-none">
              $FOXY
            </div>
          </div>
          <div className="mt-1 flex items-center text-base font-medium leading-6 text-white opacity-60">
            <div>on</div>
            <Image
              src="/images/network-icons/solana.svg"
              width={16}
              height={16}
              alt="sol net"
              className="ml-2 mr-1"
            />
            <div>Solana</div>
          </div>
          <div
            onClick={handleClaim}
            className="mt-5 box-border flex h-12 w-[240px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(255,255,255,0.01)] opacity-60 hover:opacity-70"
          >
            <div className="text-base leading-6 text-white">Claim</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CoinItem({ src }: { src: string }) {
  return (
    <div className="flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-xl bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]">
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
