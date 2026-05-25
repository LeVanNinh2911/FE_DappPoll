/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Card,
  Image,
  InputNumber,
  Progress,
  Typography,
} from "antd";

import {
  UserOutlined,
} from "@ant-design/icons";

import { getIPFSUrl } from "../../../../config/ipfs";

const { Text, Paragraph } = Typography;

interface Props {
  candidate: any;
  allocatedVotes: number;
  totalVotesUsed: number;
  totalVotingPower: number;
  onChangeVotes: (candidateId: number, votes: number) => void;
}

const CandidateAllocationCard: React.FC<Props> = ({
  candidate,
  allocatedVotes,
  totalVotesUsed,
  totalVotingPower,
  onChangeVotes
}) => {

  const supportPercent =
    totalVotingPower > 0
      ? Math.min((allocatedVotes / totalVotingPower) * 100, 100)
      : 0;

  return (
    <Card
      hoverable
      className="mb-5! rounded-2xl border! border-slate-200!"
      styles={{
        body: {
          padding: 20
        }
      }}
    >
      <div className="flex flex-col gap-5 md:flex-row">

        <div className="flex justify-center md:justify-start">
          {candidate.image ? (
            <Image
              src={getIPFSUrl(candidate.image)}
              width={140}
              height={160}
              preview={false}
              className="rounded-2xl object-cover"
              style={{
                borderRadius: 16,
                border: "1px solid #e5e7eb"
              }}
            />
          ) : (
            <div className="flex h-40 w-35 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-4xl text-slate-400">
              <UserOutlined />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col">

          {/* HEADER */}
          <div className="flex flex-wrap items-start justify-between gap-4">

            <div>
              <Text className="text-xl font-bold text-slate-800">
                {candidate.name}
              </Text>
            </div>

            {/* INPUT */}
            <div className="flex flex-col items-end">
              <Text className="mb-2 text-sm text-slate-500">
                Phân bổ phiếu
              </Text>

              <InputNumber
                min={0}
                precision={0}
                value={allocatedVotes}
                size="large"
                onChange={(value) =>
                  onChangeVotes(candidate.id, Number(value || 0))
                }
                style={{ width: 140 }}
              />
            </div>

          </div>

          {/* DESCRIPTION */}
          <Paragraph
            className="mt-4 text-sm leading-6 text-slate-500"
            ellipsis={{ rows: 3, expandable: true }}
          >
            {candidate.description || "Không có mô tả"}
          </Paragraph>

          {/* PROGRESS */}
          <div className="mt-4">

            <div className="mb-2 flex items-center justify-between">
              <Text className="text-sm text-slate-500">
                Tỷ lệ phân bổ
              </Text>

              <Text strong>
                {allocatedVotes} / {totalVotingPower}
              </Text>
            </div>

            <Progress
              percent={Number(supportPercent.toFixed(1))}
              status={
                totalVotesUsed > totalVotingPower
                  ? "exception"
                  : "active"
              }
            />

          </div>

        </div>
      </div>
    </Card>
  );
};

export default CandidateAllocationCard;