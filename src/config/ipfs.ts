/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios"

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT

// upload JSON (metadata)
export const uploadJSONToIPFS = async (data: any) => {
  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    data,
    {
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`
      }
    }
  )
  return res.data.IpfsHash
}

// upload file (image)
export const uploadFileToIPFS = async (file: File) => {
  const formData = new FormData()
  formData.append("file", file)

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
        "Content-Type": "multipart/form-data",
      }
    }
  )

  return `ipfs://${res.data.IpfsHash}`
}

export const getIPFSUrl = (url: string) => {
    if (!url) return ""

    if (url.startsWith("http")) return url

    if (url.startsWith("ipfs://")) {
      return `https://ipfs.io/ipfs/${url.replace("ipfs://", "")}`
    }

    return `https://ipfs.io/ipfs/${url}`
  }