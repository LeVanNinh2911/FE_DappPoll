/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, Button, Typography, notification, Space } from "antd"
import { type FC, useState } from "react"
import { useWriteContract } from "wagmi"
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  LockOutlined,
  SendOutlined
} from "@ant-design/icons"

import useAppWallet from "../../../../hooks/useAppWallet"
import { trustkeys } from "../../../../config/config"
import { ElectionAccessControlABI } from "../../../../config/ElectionPollABI"
import { privyWriteContract } from "../../../../hooks/privyWriteContract"
import { ACCESS_CONTROL_ADDRESS } from "../../../../config/addressContract"
import { usePositionAccess } from "../hooks/usePositionAccess"

const { Text, Title } = Typography

interface Props {
  electionAddress: `0x${string}`
  positionId: number
  isPrivate: boolean
}

const RequestAccessCard: FC<Props> = ({
  electionAddress,
  positionId,
  isPrivate
}) => {

  const writeContract = useWriteContract()
  const { addressWallet, walletType, privyWallet } = useAppWallet()

  const [loading, setLoading] = useState(false)

  const { requested, approved } = usePositionAccess({
    electionAddress,
    positionId,
    addressWallet,
    isPrivate
  })

  // ===== WRITE =====
  const write = async (functionName: string, args: any[]) => {

    if (walletType === "privy") {
      if (!privyWallet) throw new Error("Privy wallet not found")

      return await privyWriteContract({
        wallet: privyWallet,
        address: ACCESS_CONTROL_ADDRESS,
        abi: ElectionAccessControlABI,
        functionName,
        args,
        chain: trustkeys
      })
    }

    return await writeContract.mutateAsync({
      address: ACCESS_CONTROL_ADDRESS,
      abi: ElectionAccessControlABI,
      functionName,
      args
    })
  }

  // ===== HANDLE REQUEST =====
  const handleRequest = async () => {

    if (!addressWallet) {
      notification.warning({
        message: "Vui lòng kết nối ví"
      })
      return
    }

    try {

      setLoading(true)

      await write("requestAccess", [
        electionAddress,
        BigInt(positionId)
      ])

      notification.success({
        message: "Đã gửi yêu cầu",
        placement: "bottomRight"
      })

      // ❗ KHÔNG cần optimistic setState nữa
      // hook sẽ tự update qua event + polling

    } catch (err: any) {

      notification.error({
        message: "Gửi yêu cầu thất bại",
        description: err?.shortMessage || err?.message,
        placement: "bottomRight"
      })

    } finally {
      setLoading(false)
    }
  }

  // ===== HIDE =====
  if (!isPrivate || approved) return null

  return (
    <Card
      className="shadow-sm"
      style={{
        marginBottom: 16,
        borderRadius: 16,
        textAlign: "center",
        border: "1px solid #ffe3e3",
        background: "#fff5f5"
      }}
      size="small"
    >
      <Space vertical size="small" style={{ width: "100%" }}>

        <div
          style={{
            fontSize: "24px",
            color: requested ? "#3b82f6" : "#f87171"
          }}
        >
          {requested ? <ClockCircleOutlined /> : <LockOutlined />}
        </div>

        <div>
          <Title level={5} style={{ margin: 0, fontSize: "16px" }}>
            {requested
              ? "Yêu cầu đang chờ duyệt"
              : "Vị trí giới hạn"}
          </Title>

          <Text type="secondary" style={{ fontSize: "13px" }}>
            {requested
              ? "Vui lòng đợi người quản trị phê duyệt quyền cho vị trí này."
              : "Bạn cần quyền truy cập để có thể bỏ phiếu cho vị trí này."}
          </Text>
        </div>

        {requested ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#2563eb",
              fontWeight: 500,
              backgroundColor: "#eff6ff",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 12
            }}
          >
            <CheckCircleFilled />
            Đang chờ phê duyệt
          </div>
        ) : (
          <Button
            type="primary"
            size="middle"
            icon={<SendOutlined />}
            loading={loading}
            onClick={handleRequest}
            style={{
              borderRadius: 8,
              background: "#f87171",
              border: "none",
              marginTop: 4
            }}
          >
            Gửi yêu cầu truy cập
          </Button>
        )}

      </Space>
    </Card>
  )
}

export default RequestAccessCard