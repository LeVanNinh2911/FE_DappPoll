/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Modal,
  Result,
  Button,
  Space,
  Typography,
  Card,
  Divider,
  Tag
} from "antd"

import {
  CopyOutlined,
  LinkOutlined,
  BarChartOutlined
} from "@ant-design/icons"

import { useState, type FC } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import ResultModal from "../../components/ResultModal/ResultModal"

const { Text, Link } = Typography

interface Props {
  open: boolean
  onClose: () => void
  position: any
  txHash?: string
  chainExplorer?: string
}

const VoteSuccessModal: FC<Props> = ({
  open,
  onClose,
  position,
  txHash,
  chainExplorer
}) => {

  const { t } = useTranslation()

  const [resultPosition, setResultPosition] = useState<any>(null)

  const { address } = useParams()

  const txUrl =
    txHash && chainExplorer
      ? `${chainExplorer}/tx/${txHash}`
      : null

  const shortHash = txHash
    ? `${txHash.slice(0, 10)}...${txHash.slice(-8)}`
    : ""

  return (
    <>
      <Modal
        open={open}
        footer={null}
        centered
        width={600}
        onCancel={onClose}
      >
        <div className="py-4 px-2">
          {/* TITLE */}
          <Result
            status="success"
            title={
              <div className="text-3xl font-bold text-gray-800">
                {t("vote_success")}
              </div>
            }
            subTitle={
              <div className="text-base text-gray-500 mt-2">
                {t("Phiếu bầu của bạn đã được ghi nhận")}
              </div>
            }
          />

          {/* TRANSACTION CARD */}
          {txHash && (
            <Card
              className="mt-2 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <Text strong className="text-base">
                  Trạng thái ghi nhận lên Blockchain
                </Text>

                <Tag color="green">
                  Xác nhận
                </Tag>
              </div>

              <Divider className="my-3!" />

              <div className="flex flex-col gap-2">

                <Text className="text-gray-500 text-sm">
                  Mã ghi nhận
                </Text>

                <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">

                  <Text
                    code
                    style={{
                      wordBreak: "break-all",
                      fontSize: 13
                    }}
                  >
                    {shortHash}
                  </Text>

                  <Text
                    copyable={{
                      text: txHash,
                      icon: <CopyOutlined />
                    }}
                  />
                </div>

                {txUrl && (
                  <Link
                    href={txUrl}
                    target="_blank"
                    className="mt-2 text-sm"
                  >
                    <Space>
                      <LinkOutlined />
                      {t("view_on_explorer")}
                    </Space>
                  </Link>
                )}
              </div>
            </Card>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex justify-center gap-3 mt-8">

            <Button
              size="large"
              icon={<BarChartOutlined />}
              onClick={() => setResultPosition(position)}
            >
              {t("view_result")}
            </Button>

            <Button
              size="large"
              type="primary"
              onClick={onClose}
            >
              {t("close")}
            </Button>

          </div>
        </div>
      </Modal>

      {/* RESULT MODAL */}
      <ResultModal
        open={!!resultPosition}
        position={resultPosition}
        electionAddress={address as `0x${string}`}
        onClose={() => setResultPosition(null)}
      />
    </>
  )
}

export default VoteSuccessModal