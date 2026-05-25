// import { useEffect } from "react"
// import { usePrivy, useWallets } from "@privy-io/react-auth"
// import { message } from "antd"
// import { fundWallet, registerUser } from "../../services/authService"

// const AuthBootstrap = () => {
//   const { authenticated, user } = usePrivy()
//   const { wallets } = useWallets()

//   useEffect(() => {
//     const bootstrap = async () => {
//       if (!authenticated) return

//       const email = user?.google?.email || user?.email?.address
//       if (!email) return

//       const embeddedWallet = wallets.find(
//         (wallet) => wallet.walletClientType === "privy"
//       )

//       if (!embeddedWallet?.address) return

//       try {
//         await registerUser(email, embeddedWallet.address)
//         const fundResult = await fundWallet(email, embeddedWallet.address)

//         if (fundResult?.funded) {
//           message.success("Ví thử nghiệm đã được cấp gas thành công")
//         }
//       } catch (error) {
//         console.error("Auth bootstrap failed:", error)
//       }
//     }

//     bootstrap()
//   }, [authenticated, user, wallets])

//   return null
// }

// export default AuthBootstrap