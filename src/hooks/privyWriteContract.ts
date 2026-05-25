/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createWalletClient,
  custom,
  encodeFunctionData,
  numberToHex
} from "viem"
import type { Chain } from "viem"

interface PrivyWriteContractParams {
  wallet: any
  address: `0x${string}`
  abi: any
  functionName: string
  args?: any[]
  chain: Chain
}

export const privyWriteContract = async ({
  wallet,
  address,
  abi,
  functionName,
  args = [],
  chain
}: PrivyWriteContractParams) => {
  if (!wallet) {
    throw new Error("Privy wallet not found")
  }

  if (!chain) {
    throw new Error("Chain config is missing")
  }

  if (!address) {
    throw new Error("Contract address is missing")
  }

  const provider = await wallet.getEthereumProvider()

  if (!provider) {
    throw new Error("Ethereum provider not found from Privy wallet")
  }

  const targetChainHex = numberToHex(chain.id)

  const currentChainHex = (await provider.request({
    method: "eth_chainId"
  })) as string

  // 1) Ensure correct chain
  if (currentChainHex?.toLowerCase() !== targetChainHex.toLowerCase()) {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainHex }]
      })
    } catch (switchError: any) {
      // Chain chưa add vào wallet
      if (switchError?.code === 4902) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: targetChainHex,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [...chain.rpcUrls.default.http],
              blockExplorerUrls: chain.blockExplorers?.default?.url
                ? [chain.blockExplorers.default.url]
                : []
            }
          ]
        })

        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainHex }]
        })
      } else if (switchError?.code === 4001) {
        throw new Error("User rejected chain switch request")
      } else {
        console.error("Switch chain error:", switchError)
        throw switchError
      }
    }
  }

  const walletClient = createWalletClient({
    transport: custom(provider),
    chain
  })

  // 2) Lấy account an toàn hơn cho Privy
  const accounts = (await provider.request({
    method: "eth_accounts"
  })) as `0x${string}`[]

  const account = accounts?.[0]

  if (!account) {
    throw new Error("No wallet account found")
  }

  // 3) Encode function data
  const data = encodeFunctionData({
    abi,
    functionName,
    args
  })

  // 4) Send tx
  try {
    const hash = await walletClient.sendTransaction({
      account,
      to: address,
      data
    })

    return hash
  } catch (txError: any) {
    if (txError?.code === 4001) {
      throw new Error("User rejected transaction")
    }

    console.error("Send transaction error:", txError)
    throw txError
  }
}