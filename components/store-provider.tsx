"use client"

import React, { createContext, useContext } from "react"
import { useMockStore } from "@/hooks/use-mock-store"

type StoreContextType = ReturnType<typeof useMockStore>

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useMockStore()
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
