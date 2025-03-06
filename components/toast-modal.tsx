"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "@/components/ui/toast";
import { ToasterToast } from "@/lib/use-toast";
import Image from "next/image";
import React from "react";

export function ToastModal({
  id,
  title,
  open,
  description,
  action,
  iconImage,
  onCloseClick = () => {},
  ...restProps
}: ToasterToast) {
  return (
    <Toast
      key={id}
      {...restProps}
      open={open}
      className="bg-blur12 sm:widthClamp450 border-none sm:min-w-[290px] sm:max-w-[450px]"
      style={{
        userSelect: "auto",
        background: "rgba(255,255,255,0.1)",
      }}
    >
      <div className="flex w-full flex-col text-white">
        {title && (
          <ToastTitle className="text-[20px] font-medium leading-[30px]">
            <div className="flex flex-row pr-[16px]">
              {iconImage === "notion" && (
                <Image
                  src="/icons/icon-notion-white.svg"
                  width={24}
                  height={24}
                  alt="notion"
                  className="mr-[10px] h-[24px] w-[24px]"
                />
              )}
              {title}
            </div>
          </ToastTitle>
        )}
        {description && (
          <ToastDescription
            className={`break-all text-base leading-[24px] ${
              title && "pt-[12px]"
            }`}
          >
            {description}
          </ToastDescription>
        )}
      </div>
      {action}
      <ToastClose
        style={{
          background: "rgba(255,255,255,0.1)",
        }}
        onClick={onCloseClick}
      />
    </Toast>
  );
}
