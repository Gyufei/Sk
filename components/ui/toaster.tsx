"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/lib/use-toast"
import Image from "next/image";

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, iconImage, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            className="border-none bg-blur12" 
            style={{
              background: 'rgba(255,255,255,0.1)'
            }}
          >
            <div className="flex flex-col text-white">
              {title && (
                <ToastTitle className="text-[20px] font-medium leading-[30px]">
                  <div className="flex flex-row">
                    {iconImage === 'notion' && (
                      <Image
                          src="/icons/icon-notion-white.svg"
                          width={24}
                          height={24}
                          alt="notion"
                          className="mr-[10px]"
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
            />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}