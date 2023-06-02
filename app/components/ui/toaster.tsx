"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="bg-green-500 border-green-500 p-3  rounded-2xl "
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="text-zinc-200  ">{title}</ToastTitle>
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-zinc-200" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
