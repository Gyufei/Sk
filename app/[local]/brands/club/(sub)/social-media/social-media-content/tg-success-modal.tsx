"use client";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMediaQuery } from "@/lib/use-media-query";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface TgSuccessModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export default function TgSuccessModal({
  open,
  onOpenChange,
}: TgSuccessModalProps) {
  const T = useTranslations("Common");
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const modalContent = (
    <div className="flex flex-col items-center">
      <video
        src="/video/start_tg_bot.mp4"
        autoPlay
        loop
        muted
        className="mb-6 w-full rounded-lg"
      />
      <div className="mb-6 text-left w-full text-xl text-[#D6D6D6]">
        {T("TgBotGuide")}
      </div>
      <div className="flex w-full items-center justify-end">        
        <div
          className="flex h-10 px-6 items-center cursor-pointer justify-center rounded-lg border border-solid border-[rgba(255,255,255,0.6)] text-base leading-6 text-[#D6D6D6] hover:brightness-75"
          onClick={() => onOpenChange(false)}
        >
          {T("OK")}
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showOverlay={false}
          showClose={true}
          className="rounded-5 flex w-[480px] flex-col border-none bg-[#252525] p-6"
        >
          {modalContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="px-4 pb-6 pt-4">{modalContent}</div>
      </DrawerContent>
    </Drawer>
  );
}
