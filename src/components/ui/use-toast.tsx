'use client'

import * as React from 'react'

type Toast = {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  action?: React.ReactNode
}

type ToastContextType = {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

let count = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = (t: Omit<Toast, 'id'>) => {
    const id = `toast-${++count}`
    setToasts((prev) => [...prev, { id, ...t }])
    setTimeout(() => dismiss(id), 4000)
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
