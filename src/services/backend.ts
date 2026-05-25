export async function airdropToken(
  privyUserId: string | null,
  walletAddress: string
) {
  try {
    const res = await fetch("http://192.168.1.17:5000/api/airdrop", {
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