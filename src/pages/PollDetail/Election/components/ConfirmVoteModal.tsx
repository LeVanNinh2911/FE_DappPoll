{/* eslint-disable @typescript-eslint/no-explicit-any */}
import { Modal, List, Avatar, Typography, Tag, Space, Divider } from "antd"
import { CheckCircleOutlined, UserOutlined } from "@ant-design/icons"
import { type FC } from "react"
import { useTranslation } from "react-i18next"
import { getIPFSUrl } from "../../../../config/ipfs"

const { Text } = Typography

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  selectedCandidates: any[]
  title?: string
}

const ConfirmVoteModal: FC<Props> = ({
  open,
  onConfirm,
  onCancel,
  selectedCandidates,
  title
}) => {

  const { t } = useTranslation()

  return (
    <Modal
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={t("confirm_vote")}
      cancelText={t("cancel")}
      centered
      width={520}
      okButtonProps={{ size: "large", type: "primary" }}
      cancelButtonProps={{ size: "large" }}
      title={
        <Space>
          <CheckCircleOutlined style={{ color: "#1677ff" }} />
          <span>{title || t("confirm_your_vote")}</span>
        </Space>
      }
    >
      <Text type="secondary">
        {t("review_candidates_before_vote")}
      </Text>

      <Divider />

      <List
        itemLayout="horizontal"
        dataSource={selectedCandidates}
        renderItem={(item: any) => (
          <List.Item
            style={{
              padding: "12px",
              borderRadius: 8,
              border: "1px solid #f0f0f0",
              marginBottom: 8,
              background: "#fafafa"
            }}
          >
            <List.Item.Meta
              avatar={
                item.image ? (
                  <Avatar
                    size={48}
                    src={getIPFSUrl(item.image)}
                  />
                ) : (
                  <Avatar size={48} icon={<UserOutlined />} />
                )
              }
              title={
                <Space>
                  <Text strong>{item.name}</Text>
                  {item.position && (
                    <Tag color="blue">{item.position}</Tag>
                  )}
                </Space>
              }
              description={
                <Text type="secondary">
                  {t("candidate_selected_for_position")}
                </Text>
              }
            />
          </List.Item>
        )}
      />

      <Divider />

      <Text type="secondary">
        {t("vote_recorded_blockchain")}
      </Text>
    </Modal>
  )
}

export default ConfirmVoteModal