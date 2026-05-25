import { useMemo } from "react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { useConnection } from "wagmi"

type AppWalletType = "privy" | "injected" | null

export interface UseAppWalletResult {
  addressWallet?: `0x${string}`
  isConnected: boolean
  isLoading: boolean
  walletType: AppWalletType
  privyWallet: {
    address?: string
    walletClientType?: string
  } | null
}

const useAppWallet = (): UseAppWalletResult => {
  const { authenticated, ready } = usePrivy()
  const { wallets } = useWallets()
  const { address: wagmiAddress, isConnected: wagmiConnected } = useConnection()

  const hostname = window.location.hostname
  const protocol = window.location.protocol

  const canUseEmbeddedWallet =
    protocol === "https:" || hostname === "localhost"

  const privyWallet = useMemo(() => {
    return wallets.find((w) => w.walletClientType === "privy") ?? null
  }, [wallets])

  return useMemo<UseAppWalletResult>(() => {
    // 🔥 chưa sẵn sàng → đang loading
    if (!ready) {
      return {
        isConnected: false,
        isLoading: true,
        walletType: null,
        addressWallet: undefined,
        privyWallet: null
      }
    }

    const isPrivyConnected =
      canUseEmbeddedWallet &&
      authenticated &&
      !!privyWallet?.address

    if (isPrivyConnected) {
      return {
        addressWallet: privyWallet.address as `0x${string}`,
        isConnected: true,
        isLoading: false,
        walletType: "privy",
        privyWallet
      }
    }

    if (wagmiConnected && wagmiAddress) {
      return {
        addressWallet: wagmiAddress,
        isConnected: true,
        isLoading: false,
        walletType: "injected",
        privyWallet: null
      }
    }

    return {
      addressWallet: undefined,
      isConnected: false,
      isLoading: false,
      walletType: null,
      privyWallet: null
    }
  }, [
    ready,
    authenticated,
    privyWallet,
    wagmiConnected,
    wagmiAddress,
    canUseEmbeddedWallet
  ])
}

export default useAppWallet