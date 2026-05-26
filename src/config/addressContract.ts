export const ELECTION_CONTRACTS: Record<
  number,
  {
    address: `0x${string}`
    addressCompany: `0x${string}`
    rpcUrl: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    blockExplorer: string
  }
> = {
  11968: {
    address: "0x6f670bfdCcCfC03061C21DAEdf3e1c2306bC59D6",
    //0x6f670bfdCcCfC03061C21DAEdf3e1c2306bC59D6
    addressCompany:"0x01369e3C1108371a844F8B5E6CaFB3268aD181D9",
    rpcUrl: "https://l1testnet.trustkeys.network/",
    chainName: "Trustkeys Testnet",
    nativeCurrency: {
      name: "TRUSTK",
      symbol: "TRUSTK",
      decimals: 18
    },
    blockExplorer: "https://l1testnetscan.trustkeys.network/"
  }
}

export const ACCESS_CONTROL_ADDRESS = "0x9EFa0fb1778C4BDED099a67510c6f55C927ECB31" as `0x${string}`

