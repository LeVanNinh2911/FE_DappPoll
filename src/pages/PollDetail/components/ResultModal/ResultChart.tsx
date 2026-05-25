/* eslint-disable @typescript-eslint/no-explicit-any */
import { Empty, Typography } from "antd"
import { PieChartOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts"

const { Title } = Typography

type Props = {
  chartData: { name: string; value: number; fill: string }[]
  totalVotes: number
  leadingCandidate?: { name: string }
}

const ResultChart = ({ chartData, totalVotes, leadingCandidate }: Props) => {
  const { t } = useTranslation()

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null

    const item = payload[0]?.payload
    const percent = totalVotes === 0 ? 0 : ((item.value / totalVotes) * 100).toFixed(1)

    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
        <div className="mb-1 flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: item.fill }}
          />
          <span className="font-semibold text-slate-800">{item.name}</span>
        </div>
        <div className="text-sm text-slate-500">
          {item.value} {t("common.votes")} • {percent}%
        </div>
      </div>
    )
  }

  return (
    <div className="h-full rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <Title level={4} className="mb-0! flex! items-center! gap-2! text-slate-800!">
          <PieChartOutlined />
          {t("resultModal.distribution")}
        </Title>
      </div>

      {chartData.length > 0 ? (
        <>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={78}
                  outerRadius={112}
                  paddingAngle={3}
                  cornerRadius={10}
                  labelLine={false}
                />
                <RechartsTooltip content={renderCustomTooltip} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-slate-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t("resultModal.currentLeader")}
            </div>
            <div className="mt-1 truncate text-lg font-bold text-blue-950">
              {leadingCandidate?.name || "-"}
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-80 items-center justify-center">
          <Empty description={t("resultModal.noData")} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}
    </div>
  )
}

export default ResultChart