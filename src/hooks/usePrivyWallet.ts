import { useWallets } from "@privy-io/react-auth"

const usePrivyWallet = () => {
  const { wallets } = useWallets()

  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  )

  return {
    walletAddress: embeddedWallet?.address || null,
    wallet: embeddedWallet || null
  }
}

export default usePrivyWallet