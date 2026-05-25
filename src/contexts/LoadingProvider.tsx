import { useMemo, useState, type FC, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { LoadingContext, type LoadingStep } from "./LoadingContext"

const FullscreenLoading: FC<{ step: LoadingStep; visible: boolean }> = ({
  step,
  visible
}) => {
  const { t } = useTranslation()

  if (!visible && !step) return null

  return (
    <div
      className="
        fixed inset-0 z-9999
        flex flex-col items-center justify-center
        bg-black/30 backdrop-blur-sm
      "
    >
      <div className="min-w-70 rounded-2xl bg-white px-8 py-6 text-center shadow-xl">
        <div className="mb-5 flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>

        <p className="mb-1 text-lg font-semibold text-gray-800">
          {step === "wallet" && t("loading.wallet")}
          {step === "tx" && t("loading.tx")}
          {step === "confirm" && t("loading.confirm")}
          {step === "redirect" && t("loading.redirect")}
          {!step && t("loading.default")}
        </p>

        <p className="text-sm text-gray-500">
          {t("loading.doNotClose")}
        </p>
      </div>
    </div>
  )
}

export const LoadingProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [step, setStepState] = useState<LoadingStep>(null)

  const show = (nextStep: LoadingStep = null) => {
    setLoading(true)
    setStepState(nextStep)
  }

  const hide = () => {
    setLoading(false)
    setStepState(null)
  }

  const setStep = (nextStep: LoadingStep) => {
    setStepState(nextStep)
    if (nextStep) setLoading(true)
  }

  const value = useMemo(
    () => ({
      loading,
      step,
      show,
      hide,
      setStep
    }),
    [loading, step]
  )

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <FullscreenLoading visible={loading} step={step} />
    </LoadingContext.Provider>
  )
}