import { useCallback } from "react"
import { useWriteContract } from "wagmi"
import useAppWallet from "./useAppWallet"
import { privyWriteContract } from "./privyWriteContract"
import { trustkeys } from "../config/config"


type WriteParams = {
  address: `0x${string}`
  abi: any
  functionName: string
  args: any[]
}

export const useElectionWriteContract = () => {
  const wagmiWrite = useWriteContract()
  const { walletType, privyWallet } = useAppWallet()

  const write = useCallback(
    async ({ address, abi, functionName, args }: WriteParams) => {
      // Privy wallet flow
      if (walletType === "privy") {
        if (!privyWallet) throw new Error("Privy wallet not found")

        return await privyWriteContract({
          wallet: privyWallet,
          address,
          abi,
          functionName,
          args,
          chain: trustkeys
        })
      }

      // Wagmi flow
      return await wagmiWrite.writeContractAsync({
        address,
        abi,
        functionName,
        args
      })
    },
    [walletType, privyWallet, wagmiWrite]
  )

  return { write }
}