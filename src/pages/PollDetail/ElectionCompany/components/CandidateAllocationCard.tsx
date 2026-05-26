/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";

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

const { Text } = Typography;

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
  onChangeVotes,
}) => {
  const [expanded, setExpanded] = useState(false);

  const description =
    candidate.description?.trim() || "Không có mô tả";

  const shouldShowExpandButton =
    description.length > 150;

  const supportPercent =
    totalVotingPower > 0
      ? Math.min(
          (allocatedVotes / totalVotingPower) * 100,
          100
        )
      : 0;

  const hasAllocation = allocatedVotes > 0;

  return (
    <Card
      hoverable
      className={`
        mb-5! overflow-hidden rounded-2xl border transition-all duration-300
        ${
          hasAllocation
            ? "border-blue-700 bg-blue-50"
            : "border-slate-200"
        }
      `}
      styles={{
        body: {
          padding: 20,
        },
      }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        {/* IMAGE */}
        <div className="flex justify-center md:justify-start">
          {candidate.image ? (
            <Image
              src={getIPFSUrl(candidate.image)}
              preview={false}
              className="overflow-hidden rounded-xl"
              style={{
                width: "100%",
                maxWidth: 180,
                height: 180,
                objectFit: "cover",
                borderRadius: 16,
                border: hasAllocation
                  ? "2px solid #93c5fd"
                  : "1px solid #e5e7eb",
              }}
            />
          ) : (
            <div className="flex h-45 w-45 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-4xl text-slate-400">
              <UserOutlined />
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col">
          {/* HEADER */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Text className="text-lg font-bold text-slate-800 sm:text-lg md:text-xl">
                {candidate.name}
              </Text>
            </div>

            <div className="flex flex-col sm:items-end">
              <Text className="mb-2 text-sm text-slate-500">
                Phân bổ phiếu
              </Text>

              <InputNumber
                min={0}
                precision={0}
                value={allocatedVotes}
                size="large"
                onChange={(value) =>
                  onChangeVotes(
                    candidate.id,
                    Number(value || 0)
                  )
                }
                className="w-full sm:w-35"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-4">
            <p
              className={`
                text-sm leading-6 text-slate-500 md:text-base
                ${
                  expanded
                    ? ""
                    : "line-clamp-3 md:line-clamp-none"
                }
              `}
            >
              {description}
            </p>

            {shouldShowExpandButton && (
              <button
                type="button"
                onClick={() =>
                  setExpanded((prev) => !prev)
                }
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 md:hidden"
              >
                {expanded ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>

          {/* PROGRESS */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <Text className="text-sm text-slate-500">
                Tỷ lệ phân bổ
              </Text>

              <Text strong>
                {allocatedVotes} / {totalVotingPower}
              </Text>
            </div>

            <Progress
              percent={Number(
                supportPercent.toFixed(1)
              )}
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