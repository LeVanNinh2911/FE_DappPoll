// config/wagmi.ts
import { createConfig, http } from "wagmi"
import { createPublicClient, defineChain } from "viem"
import { injected, walletConnect } from "wagmi/connectors"

// 🔗 Custom chain
export const trustkeys = defineChain({
  id: 11968,
  name: "Trustkeys Network Testnet",
  nativeCurrency: {
    name: "TRUSTK",
    symbol: "TRUSTK",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ["https://l1testnet.trustkeys.network/"]
    }
  },
  blockExplorers: {
    default: {
      name: "Trustkeys Explorer",
      url: "https://l1testnetscan.trustkeys.network/"
    }
  }
})

const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

export const config = createConfig({
  chains: [trustkeys],
  transports: {
    [trustkeys.id]: http()
  },
  connectors: [
    injected(),
    walletConnect({
    projectId: WALLET_CONNECT_PROJECT_ID,
    showQrModal: true,
    metadata: {
        name: "ElectionPoll",
        description: "Voting dApp",
        url: window.location.origin,
        icons: []
    }
    })
  ]
})

export const publicClient = createPublicClient({
  chain: trustkeys,
  transport: http()
})
