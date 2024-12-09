"use client"

import {
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/lib/use-toast"
import { ToastModal } from "./toast-modal";

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function (props) {
        return (
          <ToastModal
            key={props.id} 
            {...props}
          />
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}