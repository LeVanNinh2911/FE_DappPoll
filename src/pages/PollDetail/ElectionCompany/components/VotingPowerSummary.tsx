/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Card,
  Col,
  Progress,
  Row,
  Statistic,
  Tag,
  Typography
} from "antd"

import {
  CheckCircleOutlined,
  WarningOutlined,
  LockOutlined,
  PieChartOutlined
} from "@ant-design/icons"

const { Text } = Typography

interface Props {
  totalVotingPower: number
  usedVotes: number
  remainingVotes: number

  hasVoted?: boolean
  votedAt?: string
}

const VotingPowerSummary: React.FC<Props> = ({
  totalVotingPower,
  usedVotes,
  remainingVotes,
  hasVoted = false,
  votedAt
}) => {

  const percent =
    totalVotingPower > 0
      ? Math.min((usedVotes / totalVotingPower) * 100, 100)
      : 0

  const exceeded = usedVotes > totalVotingPower

  const fullyAllocated =
    usedVotes === totalVotingPower ||
    remainingVotes === 0

  return (
    <Card
      className={`
        mb-6! rounded-2xl border
        ${
          hasVoted
            ? "border-emerald-100 bg-emerald-50"
            : "border-blue-100 bg-blue-50"
        }
      `}
      styles={{ body: { padding: 22} }}
    >

      {/* HEADER */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

        <div className="flex items-center gap-3">

          <div
            className={`
              flex h-12 w-12 items-center justify-center rounded-2xl
              ${
                hasVoted
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-blue-100 text-blue-600"
              }
            `}
          >
            {
              hasVoted
                ? <CheckCircleOutlined />
                : <PieChartOutlined />
            }
          </div>

          <div>

            <Text
              className={`
                text-xl font-bold
                ${
                  hasVoted
                    ? "text-emerald-900"
                    : "text-blue-900"
                }
              `}
            >
              {
                hasVoted
                  ? "Kết quả bỏ phiếu"
                  : "Tổng quan quyền biểu quyết"
              }
            </Text>

            <div className="mt-1 text-sm text-slate-500">
              {
                hasVoted
                  ? "Phiếu bầu đã được xác nhận và lưu trữ on-chain"
                  : "Kiểm tra tổng số phiếu và mức độ phân bổ"
              }
            </div>

          </div>

        </div>

        {/* STATUS */}
        {
          hasVoted ? (
            <Tag color="success" className="rounded-full px-3 py-1">
              <CheckCircleOutlined /> Đã bỏ phiếu
            </Tag>
          ) : exceeded ? (
            <Tag color="error" className="rounded-full px-3 py-1">
              <WarningOutlined /> Vượt giới hạn quyền biểu quyết
            </Tag>
          ) : fullyAllocated ? (
            <Tag color="success" className="rounded-full px-3 py-1">
              <CheckCircleOutlined /> Đã phân bổ toàn bộ
            </Tag>
          ) : (
            <Tag color="processing" className="rounded-full px-3 py-1">
              Còn phiếu chưa sử dụng
            </Tag>
          )
        }

      </div>

      {/* STATS */}
      <Row gutter={[16, 16]}>

        <Col xs={24} md={8}>
          <Card bordered={false} className="rounded-2xl">
            <Statistic
              title="Tổng quyền biểu quyết"
              value={totalVotingPower}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} className="rounded-2xl">
            <Statistic
              title={
                hasVoted
                  ? "Đã sử dụng"
                  : "Đã phân bổ"
              }
              value={usedVotes}
              valueStyle={{
                color:
                  hasVoted
                    ? "#16a34a"
                    : exceeded
                      ? "#dc2626"
                      : "#2563eb"
              }}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} className="rounded-2xl">
            <Statistic
              title={
                hasVoted
                  ? "Trạng thái"
                  : "Còn lại"
              }
              value={
                hasVoted
                  ? "Hoàn tất"
                  : remainingVotes
              }
              valueStyle={{
                color:
                  hasVoted
                    ? "#16a34a"
                    : remainingVotes === 0
                      ? "#16a34a"
                      : "#d97706"
              }}
            />
          </Card>
        </Col>

      </Row>

      {/* PROGRESS */}
      <div className="mt-6">

        <div className="mb-2 flex items-center justify-between">

          <Text className="text-slate-500">
            {
              hasVoted
                ? "Tỷ lệ sử dụng quyền biểu quyết"
                : "Tiến độ phân bổ"
            }
          </Text>

          <Text strong>
            {usedVotes} / {totalVotingPower}
          </Text>

        </div>

        <Progress
          percent={Number(percent.toFixed(1))}
          status={
            hasVoted
              ? "success"
              : exceeded
                ? "exception"
                : fullyAllocated
                  ? "success"
                  : "active"
          }
        />

      </div>

      {/* VOTED INFO */}
      {
        hasVoted && (
          <div
            className="
              mt-5 rounded-2xl border border-emerald-200
              bg-white p-4
            "
          >

            <div className="flex items-start gap-3">

              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl bg-emerald-100 text-emerald-600
                "
              >
                <LockOutlined />
              </div>

              <div>

                <Text strong className="text-emerald-800">
                  Phiếu bầu đã được xác nhận
                </Text>

                <div className="mt-1 text-sm text-slate-500">
                  Dữ liệu bỏ phiếu đã được lưu trữ trên blockchain
                  và không thể chỉnh sửa sau khi xác nhận.
                </div>

                {
                  votedAt && (
                    <div className="mt-2 text-xs text-slate-400">
                      Thời gian bỏ phiếu: {votedAt}
                    </div>
                  )
                }

              </div>

            </div>

          </div>
        )
      }

      {/* REMAINING */}
      {
        !hasVoted &&
        !fullyAllocated &&
        !exceeded && (
          <div
            className="
              mt-5 rounded-2xl border border-slate-200
              bg-white p-4 text-sm text-slate-500
            "
          >
            Bạn vẫn còn
            {" "}
            <strong>{remainingVotes}</strong>
            {" "}
            phiếu chưa sử dụng.
            Bạn có thể tiếp tục phân bổ trước khi xác nhận bỏ phiếu cuối cùng.
          </div>
        )
      }

    </Card>
  )
}

export default VotingPowerSummary