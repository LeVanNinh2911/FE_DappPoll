/* eslint-disable @typescript-eslint/no-explicit-any */

import { notification } from "antd"

import {
  writeContract,
  waitForTransactionReceipt
} from "@wagmi/core"

import { config } from "../config/config"

import { useGlobalLoading } from "../contexts/LoadingContext"

type WriteTxParams = {
  address: `0x${string}`
  abi: any
  functionName: string
  args?: any[]
  successMessage?: string
}

export const useWriteTxWithConfirm = () => {

  const {
    show,
    hide,
    setStep
  } = useGlobalLoading()

  const writeTx = async ({
    address,
    abi,
    functionName,
    args,
    successMessage = "Transaction successful"
  }: WriteTxParams) => {

    try {

      
      show("wallet")

      const hash = await writeContract(config, {
        address,
        abi,
        functionName,
        args
      })

      setStep("confirm")

      const receipt = await waitForTransactionReceipt(
        config,
        {
          hash
        }
      )

      if (receipt.status !== "success") {
        throw new Error("Transaction reverted")
      }

      hide()

      notification.success({
        message: successMessage,
        placement: "bottomRight"
      })

      return {
        hash,
        receipt
      }

    } catch (err: any) {

      console.error(err)

      hide()

      if (
        err?.name === "UserRejectedRequestError"
      ) {

        notification.warning({
          message: "Transaction rejected",
          placement: "bottomRight"
        })

        return null
      }

      notification.error({
        message: "Transaction failed",
        description:
          err?.shortMessage ||
          err?.message ||
          "Something went wrong",
        placement: "bottomRight"
      })

      throw err
    }
  }

  return { writeTx }
}