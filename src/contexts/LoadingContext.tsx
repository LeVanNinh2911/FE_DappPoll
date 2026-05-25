import { createContext, useContext } from "react"

export type LoadingStep = "wallet" | "tx" | "confirm" | "redirect" | null

export type LoadingContextType = {
  loading: boolean
  step: LoadingStep
  show: (step?: LoadingStep) => void
  hide: () => void
  setStep: (step: LoadingStep) => void
}

export const LoadingContext = createContext<LoadingContextType | null>(null)

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error("useGlobalLoading must be used within LoadingProvider")
  }
  return context
}