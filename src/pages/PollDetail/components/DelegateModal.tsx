/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Typography,
  Space
} from "antd"
import {
  UserSwitchOutlined,
  CloseCircleOutlined
} from "@ant-design/icons"
import { type FC, useEffect, useState } from "react"
import { isAddress } from "viem"
import { ElectionABI } from "../../../config/ElectionPollABI"
import { readVoter } from "../../../components/readContract"
import type { VoterInfo } from "../../../types/types"
import { useTranslation } from "react-i18next"
import useAppWallet from "../../../hooks/useAppWallet"
import { useElectionWriteContract } from "../../../hooks/useElectionWriteContract"

const { Text } = Typography

type Props = {
  open: boolean
  onClose: () => void
  electionAddress: `0x${string}`
  positionId: number
}

const DelegateModal: FC<Props> = ({
  open,
  onClose,
  electionAddress,
  positionId
}) => {
  const [form] = Form.useForm()

  const { addressWallet } = useAppWallet()
  const { write } = useElectionWriteContract()

  const [loadingTx, setLoadingTx] = useState(false)

  const [currentVoter, setCurrentVoter] =
    useState<VoterInfo | null>(null)

  const { t } = useTranslation()

  useEffect(() => {
    const load = async () => {
      try {
        if (addressWallet) {
          const voter = await readVoter(
            electionAddress,
            positionId,
            addressWallet
          )

          setCurrentVoter(voter as VoterInfo)
        }
      } catch (err) {
        console.error(err)
      }
    }

    if (open) load()
  }, [open, electionAddress, addressWallet, positionId])

  const handleDelegate = async () => {
    try {
      if (!addressWallet) {
        notification.warning({
          message: t("electionDetails.connectWallet"),
          placement: "bottomRight"
        })

        return
      }

      const values = await form.validateFields()

      const to = values.address

      if (!isAddress(to)) {
        notification.error({
          message: t("delegateModal.invalidAddress"),
          placement: "bottomRight"
        })

        return
      }

      if (
        to.toLowerCase() === addressWallet.toLowerCase()
      ) {
        notification.error({
          message: t(
            "delegateModal.cannotDelegateToYourself"
          ),
          placement: "bottomRight"
        })

        return
      }

      setLoadingTx(true)

      await write({
        address: electionAddress,
        abi: ElectionABI,
        functionName: "delegateVote",
        args: [positionId, to]
      })

      notification.success({
        message: t(
          "delegateModal.delegationSuccessful"
        ),
        placement: "bottomRight"
      })

      form.resetFields()
      onClose()
    } catch (err: any) {
      notification.error({
        message: t("delegateModal.delegationFailed"),
        description:
          err?.shortMessage || err?.message,
        placement: "bottomRight"
      })
    } finally {
      setLoadingTx(false)
    }
  }

  const alreadyVoted = !!currentVoter?.voted

  return (
    <Modal
      open={open}
      centered
      width={460}
      title={
        <Space>
          <UserSwitchOutlined
            style={{ color: "#1e3a8a" }}
          />

          <span className="font-semibold text-blue-900">
            {t("delegateModal.title")}
          </span>
        </Space>
      }
      onCancel={() => {
        form.resetFields()
        onClose()
      }}
      footer={null}
    >
      <Divider
        style={{ margin: "12px 0 18px" }}
      />

      {alreadyVoted && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <Text type="danger">
            <CloseCircleOutlined />{" "}
            {t(
              "delegateModal.alreadyVotedDisabled"
            )}
          </Text>
        </div>
      )}

      <Form form={form} layout="vertical">
        <Form.Item
          label={
            <span className="font-medium">
              {t(
                "delegateModal.delegateToAddress"
              )}
            </span>
          }
          name="address"
          rules={[
            {
              required: true,
              message: t(
                "delegateModal.pleaseEnterAddress"
              )
            },
            {
              validator: (_, value) => {
                if (!value || isAddress(value)) {
                  return Promise.resolve()
                }

                return Promise.reject(
                  new Error(
                    t(
                      "delegateModal.invalidAddress"
                    )
                  )
                )
              }
            }
          ]}
        >
          <Input
            size="large"
            placeholder={t(
              "delegateModal.addressPlaceholder"
            )}
          />
        </Form.Item>

        <Button
          type="primary"
          size="large"
          block
          loading={loadingTx}
          disabled={
            !isAddress(
              form.getFieldValue("address")
            ) || alreadyVoted
          }
          onClick={handleDelegate}
        >
          {t("delegateModal.delegate")}
        </Button>
      </Form>
    </Modal>
  )
}

export default DelegateModal