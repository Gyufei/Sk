"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "@/components/ui/toast"
import { ToasterToast } from "@/lib/use-toast";
import Image from "next/image";
import React from "react";


export function ToastModal(props: ToasterToast): React.ReactNode {
  const { id, title, open, description, action, iconImage, onCloseClick = () => {}, ...restProps } = props;
  return (
    <Toast 
      key={id} 
      {...restProps}
      open={open}
      className="border-none bg-blur12" 
      style={{
        background: 'rgba(255,255,255,0.1)'
      }}
    >
      <div className="flex flex-col text-white w-full">
        {title && (
          <ToastTitle className="text-[20px] font-medium leading-[30px]">
            <div className="flex flex-row pr-[36px]">
              {iconImage === 'notion' && (
                <Image
                    src="/icons/icon-notion-white.svg"
                    width={24}
                    height={24}
                    alt="notion"
                    className="mr-[10px] w-[24px] h-[24px]"
                  />
              )}
              {title}
            </div>
            
          </ToastTitle>
        )}
        {description && (
          <ToastDescription className={`break-all text-base leading-[24px] ${title && "pt-[12px]"}`}>{description}</ToastDescription>
        )}
      </div>
      {action}
      <ToastClose
        style={{
          background: 'rgba(255,255,255,0.1)'
        }}
        onClick={onCloseClick}
      />
    </Toast>
  )
}