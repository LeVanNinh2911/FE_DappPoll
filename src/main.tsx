/* eslint-disable @typescript-eslint/no-explicit-any */
// import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Buffer } from "buffer"
import "./index.css"
import "./config/i18n"
import App from "./App.tsx"
import { PrivyProvider } from "@privy-io/react-auth"
import { WagmiProvider } from "wagmi"
import { config, trustkeys } from "./config/config.ts"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { LoadingProvider } from "./contexts/LoadingProvider.tsx"

const queryClient = new QueryClient()

;(window as any).Buffer = Buffer
;(window as any).global = window

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        loginMethods: ["google", "email"],
        appearance: {
          theme: "light",
          accentColor: "#1e3a8a",
          showWalletLoginFirst: false
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets"
          }
        },
        defaultChain: trustkeys,
        supportedChains: [trustkeys]
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  </BrowserRouter>
  // </StrictMode>
)