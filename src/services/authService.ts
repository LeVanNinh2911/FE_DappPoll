const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


export const fundWallet = async (email: string, walletAddress: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/fund-wallet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, walletAddress })
  })

  return response.json()
}