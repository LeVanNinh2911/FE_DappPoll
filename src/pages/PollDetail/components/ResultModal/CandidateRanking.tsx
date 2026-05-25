import { Image, Progress, Tag, Tooltip, Typography, Empty } from "antd"
import { TrophyOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"

const { Text, Title, Paragraph } = Typography

const BLUE_PALETTE = ["#1e3a8a", "#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"]

type CandidateItem = {
  id: number
  name: string
  voteCount: number
  image: string
  description: string
}

type Props = {
  candidates: CandidateItem[]
  totalVotes: number
  winnerVotes: number
}

const CandidateRanking = ({ candidates, totalVotes, winnerVotes }: Props) => {
  const { t } = useTranslation()

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <Title level={4} className="mb-0! text-slate-800!">
          {t("resultModal.candidateRanking")}!
        </Title>
        <Text className="text-sm text-slate-500">
          {candidates.length} {t("resultModal.candidates")}
        </Text>
      </div>

      <div className="max-h-130 space-y-4 overflow-y-auto pr-2">
        {candidates.map((c, index) => {
          const isWinner = c.voteCount === winnerVotes && c.voteCount > 0
          const percent = totalVotes === 0 ? 0 : (c.voteCount / totalVotes) * 100
          const barColor = BLUE_PALETTE[index % BLUE_PALETTE.length]

          return (
            <div
              key={c.id}
              className={`rounded-2xl border p-4 transition-all ${
                isWinner
                  ? "border-blue-200 bg-blue-50/70"
                  : "border-slate-100 bg-slate-50/50 hover:border-blue-100 hover:bg-white"
              }`}
            >
              <div className="mb-3 flex items-start gap-4">
                <div className="relative shrink-0">
                  {c.image ? (
                    <Image
                      src={c.image}
                      width={58}
                      height={58}
                      preview={false}
                      className="rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-900 text-lg font-bold text-white">
                      {index + 1}
                    </div>
                  )}

                  {isWinner && (
                    <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-amber-400 text-white shadow">
                      <TrophyOutlined style={{ fontSize: 12 }} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Text
                          strong
                          className={`block truncate ${
                            isWinner ? "text-lg text-blue-950" : "text-slate-800"
                          }`}
                        >
                          {c.name}
                        </Text>
                        <Tag className="rounded-full border-none bg-slate-100 text-slate-600">
                          #{index + 1}
                        </Tag>
                      </div>

                      {c.description && (
                        <Tooltip title={c.description}>
                          <Paragraph
                            ellipsis={{ rows: 1 }}
                            className="mt-1! mb-0! text-sm text-slate-500!"
                          >
                            {c.description}
                          </Paragraph>
                        </Tooltip>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-950">{c.voteCount}</div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {percent.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <Progress
                    percent={percent}
                    showInfo={false}
                    strokeColor={barColor}
                    strokeWidth={9}
                    className="m-0!"
                  />
                </div>
              </div>
            </div>
          )
        })}

        {candidates.length === 0 && (
          <Empty description={t("resultModal.noData")} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  )
}

export default CandidateRanking