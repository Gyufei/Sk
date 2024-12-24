"use client";

import Image from "next/image";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({
  ...props
}: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal {...props} />
);
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-white/80 backdrop-blur-sm",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showClose?: boolean;
    showOverlay?: boolean;
  }
>(
  (
    { className, children, showClose = true, showOverlay = true, ...props },
    ref,
  ) => (
    <DialogPortal>
      {showOverlay && <DialogOverlay />}
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "no-outline shadow-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 rounded-3xl border-2 border-black bg-white p-6 duration-200",
          className,
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close className="shadow-1 hover:bg-yellow absolute right-4 top-[20px] flex h-8 w-8 items-center justify-center rounded-full border border-black text-black outline-0 transition-opacity disabled:pointer-events-none">
            <Image
              src="/icons/close-x.svg"
              width={24}
              height={24}
              alt="close"
            />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-haasDisp text-xl leading-[30px] text-white",
      className,
    )}
    {...props}
  >
    <div className="flex items-center">
      {props.children}
    </div>
  </DialogPrimitive.Title>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription };
