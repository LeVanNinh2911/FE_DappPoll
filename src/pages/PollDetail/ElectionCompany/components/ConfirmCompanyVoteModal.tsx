/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Avatar,
  Divider,
  List,
  Modal,
  Progress,
  Space,
  Statistic,
  Tag,
  Typography,
  Row,
  Col
} from "antd";

import {
  CheckCircleOutlined,
  TrophyOutlined,
  UserOutlined
} from "@ant-design/icons";

import { type FC } from "react";
import { useTranslation } from "react-i18next";

import { getIPFSUrl } from "../../../../config/ipfs";

const { Text } = Typography;

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  allocations: {
    candidate: any;
    votes: number;
  }[];
  totalVotingPower: number;
  usedVotes: number;
  remainingVotes: number;
  title?: string;
}

const ConfirmCompanyVoteModal: FC<Props> = ({
  open,
  onConfirm,
  onCancel,
  allocations,
  totalVotingPower,
  usedVotes,
  remainingVotes,
  title
}) => {
  const { t } = useTranslation();

  const percent =
    totalVotingPower > 0
      ? Math.min((usedVotes / totalVotingPower) * 100, 100)
      : 0;

  return (
    <Modal
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      centered
      width={720}
      okText={t("confirm_vote")}
      cancelText={t("cancel")}
      okButtonProps={{ size: "large", type: "primary" }}
      cancelButtonProps={{ size: "large" }}
      title={
        <Space>
          <CheckCircleOutlined style={{ color: "#1677ff" }} />
          <span>{title || "Xác nhận phân bổ phiếu bầu"}</span>
        </Space>
      }
    >

      <Text type="secondary">
        Vui lòng kiểm tra lại toàn bộ phân bổ phiếu trước khi xác nhận giao dịch.
      </Text>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Statistic title="Tổng quyền biểu quyết" value={totalVotingPower} />
        </Col>

        <Col span={8}>
          <Statistic
            title="Đã sử dụng"
            value={usedVotes}
            valueStyle={{ color: "#2563eb" }}
          />
        </Col>

        <Col span={8}>
          <Statistic
            title="Còn lại"
            value={remainingVotes}
            valueStyle={{
              color: remainingVotes === 0 ? "#16a34a" : "#d97706"
            }}
          />
        </Col>
      </Row>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <Text type="secondary">Tiến độ phân bổ</Text>
          <Text strong>
            {usedVotes} / {totalVotingPower}
          </Text>
        </div>

        <Progress
          percent={Number(percent.toFixed(1))}
          status={remainingVotes === 0 ? "success" : "active"}
        />
      </div>

      <Divider />

      <List
        itemLayout="horizontal"
        dataSource={allocations}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: 14,
              borderRadius: 14,
              border: "1px solid #f1f5f9",
              marginBottom: 10,
              background: "#fafcff"
            }}
          >
            <List.Item.Meta
              avatar={
                item.candidate?.image ? (
                  <Avatar
                    size={54}
                    src={getIPFSUrl(item.candidate.image)}
                  />
                ) : (
                  <Avatar size={54} icon={<UserOutlined />} />
                )
              }
              title={
                <div className="flex items-center justify-between gap-3">
                  <Space>
                    <Text strong>{item.candidate.name}</Text>

                    <Tag color="blue">
                      <TrophyOutlined /> {item.candidate.voteCount || 0} phiếu
                    </Tag>
                  </Space>

                  <Tag color="processing" className="rounded-full px-3 py-1">
                    {item.votes} phiếu
                  </Tag>
                </div>
              }
              description={
                <Text type="secondary">
                  {item.candidate.description || t("no_description")}
                </Text>
              }
            />
          </List.Item>
        )}
      />

      <Divider />

      {remainingVotes > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Bạn vẫn còn <strong>{remainingVotes}</strong> phiếu chưa sử dụng.
          Bạn có thể tiếp tục phân bổ hoặc xác nhận ngay giao dịch.
        </div>
      ) : (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Bạn đã phân bổ toàn bộ quyền biểu quyết thành công.
        </div>
      )}
    </Modal>
  );
};

export default ConfirmCompanyVoteModal;