const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export async function airdropToken(
  privyUserId: string | null,
  walletAddress: string
) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/airdrop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        privyUserId,
        address: walletAddress 
      })
    })

    if (!res.ok) {
      throw new Error("Airdrop request failed")
    }

    const data = await res.json()
    return data
  } catch (err) {
    console.error("Airdrop error:", err)
    return null
  }
}