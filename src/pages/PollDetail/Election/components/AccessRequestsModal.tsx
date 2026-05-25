/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Button,
  Typography,
  Space,
  notification,
  List,
  Avatar,
  Tag,
  Card,
  Empty
} from "antd"
import { type FC, useEffect, useState } from "react"
import { useWriteContract } from "wagmi"
import { publicClient, trustkeys } from "../../../../config/config"
import { ElectionAccessControlABI } from "../../../../config/ElectionPollABI"
import { privyWriteContract } from "../../../../hooks/privyWriteContract"
import useAppWallet from "../../../../hooks/useAppWallet"
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined
} from "@ant-design/icons"
import { ACCESS_CONTROL_ADDRESS } from "../../../../config/addressContract"
import { AddressWithCopy } from "../../../../components/ConnectWallet"

const { Title, Text } = Typography

interface Props {
  electionAddress: `0x${string}`
  positionId: number
  isCreator: boolean
  reload: () => void
  open: boolean
  onClose: () => void
}

const AccessRequestsModal: FC<Props> = ({
  electionAddress,
  positionId,
  isCreator,
  reload,
  open,
  onClose
}) => {
  const writeContract = useWriteContract()
  const { walletType, privyWallet } = useAppWallet()

  const [requests, setRequests] = useState<string[]>([])
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

  // ===== READ =====
  const loadRequests = async () => {
    if (!isCreator) return
    try {
      const result = await publicClient.readContract({
        address: ACCESS_CONTROL_ADDRESS,
        abi: ElectionAccessControlABI,
        functionName: "getRequests",
        args: [electionAddress, BigInt(positionId)]
      })
      setRequests(result as string[])
    } catch (err) {
      console.error("Load requests error:", err)
    }
  }

  useEffect(() => {
    if (open) loadRequests()
  }, [open, electionAddress, positionId, isCreator])

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
    } else {
      return await writeContract.mutateAsync({
        address: ACCESS_CONTROL_ADDRESS,
        abi: ElectionAccessControlABI,
        functionName,
        args
      })
    }
  }

  // ===== ACTION =====
  const handleAction = async (voterAddr: string, action: "approve" | "reject") => {
    try {
      setLoadingMap((p) => ({ ...p, [voterAddr]: true }))

      const func = action === "approve" ? "approveVoter" : "rejectVoter"
      const args = [electionAddress, BigInt(positionId), voterAddr]

      await write(func, args)

      notification.success({
        message: action === "approve" ? "Đã duyệt quyền bầu chọn" : "Đã từ chối yêu cầu",
        placement: "bottomRight"
      })

      await loadRequests()
      reload()
    } catch (err: any) {
      notification.error({
        message: "Thao tác thất bại",
        description: err?.shortMessage || err?.message,
        placement: "bottomRight"
      })
    } finally {
      setLoadingMap((p) => ({ ...p, [voterAddr]: false }))
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      styles={{
        body: { paddingTop: 12 }
      }}
      title={
        <Space vertical size={2}>
          <Title level={5} style={{ margin: 0 }}>
            Yêu cầu quyền tham gia
          </Title>

          <Space>
            <Text type="secondary">
              Các yêu cầu đang chờ phê duyệt quyền bỏ phiếu
            </Text>
            <Tag color="orange">{requests.length}</Tag>
          </Space>
        </Space>
      }
    >
      <List
        dataSource={requests}
        locale={{
          emptyText: (
            <Empty
              description="Không có yêu cầu nào"
              style={{ padding: "24px 0" }}
            />
          )
        }}
        renderItem={(addr) => (
          <Card
            size="small"
            style={{
              marginBottom: 10,
              borderRadius: 12,
              border: "1px solid #f0f0f0",
              transition: "all 0.2s"
            }}
            bodyStyle={{
              padding: 12
            }}
            hoverable
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Space align="start">
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  style={{
                    background: "linear-gradient(135deg, #1e3a8a, #2563eb)"
                  }}
                />

                <div>
                  <div style={{ fontWeight: 500 }}>
                    <AddressWithCopy address={addr} />
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Pending approval
                  </Text>
                </div>
              </Space>

              <Space>
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  loading={loadingMap[addr]}
                  onClick={() => handleAction(addr, "approve")}
                  style={{
                    borderRadius: 8,
                    background: "#10b981",
                    border: "none"
                  }}
                >
                  Duyệt
                </Button>

                <Button
                  danger
                  size="small"
                  icon={<CloseCircleOutlined />}
                  loading={loadingMap[addr]}
                  onClick={() => handleAction(addr, "reject")}
                  style={{ borderRadius: 8 }}
                >
                  Từ chối
                </Button>
              </Space>
            </div>
          </Card>
        )}
      />
    </Modal>
  )
}

export default AccessRequestsModal