import * as React from "react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/use-media-query";

export function PopDrawer({
  title,
  open,
  onOpenChange,
  children,
  popContent,
  popContentClass,
  className,
  triggerProps = {},
}: {
  title: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  children?: React.ReactNode;
  popContent?: React.ReactNode;
  popContentClass?: string;
  triggerProps?: any;
  className?: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild {...triggerProps}>
          {children}
        </PopoverTrigger>
        <PopoverContent
          className={`no-scroll-bar flex w-[200px] flex-col items-stretch space-y-2 overflow-y-auto border-none bg-[#262626] p-4 ${popContentClass}`}
        >
          {popContent}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className={className}>
        <DrawerHeader className="py-0 text-center">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="no-scroll-bar max-h-[calc(100vh-200)] overflow-y-auto">
          {popContent}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
