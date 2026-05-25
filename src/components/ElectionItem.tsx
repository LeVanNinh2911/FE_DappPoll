{/* eslint-disable @typescript-eslint/no-explicit-any */}
import { Button, Typography } from "antd"
import type { FC } from "react"
import { ClockCircleFilled, UserOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import type { ElectionInfoItem } from "../types/types"
import { useTranslation } from "react-i18next"

const { Title, Text, Paragraph } = Typography

const ElectionItem: FC<{
  item: ElectionInfoItem
  detailPath?: (address: `0x${string}`) => string
}> = ({ item, detailPath }) => {
  const { t } = useTranslation()

  const getStatusInfo = (startTime: number, endTime: number) => {
    const now = dayjs().unix()
    const start = startTime
    const end = endTime

    if (now < start) {
      return {
        key: "upcoming",
        label: t("electionItem.upcoming"),
        tagClassName: "bg-orange-400 text-white"
      }
    }

    if (now > end) {
      return {
        key: "ended",
        label: t("electionItem.ended"),
        tagClassName: "bg-red-500 text-white"
      }
    }

    return {
      key: "ongoing",
      label: t("electionItem.ongoing"),
      tagClassName: "bg-emerald-500 text-white"
    }
  }

  const status = getStatusInfo(item.startTime, item.endTime)

  const startDateTime = dayjs
    .unix(Number(item.startTime))
    .format("HH:mm DD/MM/YYYY")
  const endDateTime = dayjs.unix(Number(item.endTime)).format("HH:mm DD/MM/YYYY")

  const description = item.description || t("electionItem.noDescription")

  return (
    <div
      className="
        mb-5 overflow-hidden rounded-lg
        border border-slate-200 bg-white shadow-sm
        transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-lg
      "
    >
      <div className="relative border-b border-slate-100 px-5 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <Title
              level={4}
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 700,
                color: "#1e2a78"
              }}
            >
              {item.title}
            </Title>
          </div>

          <div className="shrink-0">
            <span
              className={`inline-flex rounded-lg border px-4 py-1.5 text-sm font-semibold shadow-sm ${status.tagClassName}`}
            >
              {status.label}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <Paragraph
          ellipsis={{ rows: 2 }}
          style={{
            marginBottom: 14,
            color: "#4b5563",
            fontSize: "15px"
          }}
        >
          {description}
        </Paragraph>

        <div className="mb-4 border-t border-slate-200 pt-3">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[15px] text-slate-700">
            <div className="flex items-center gap-2">
              <UserOutlined className="text-slate-500" />
              <Text className="text-[15px] text-slate-700">
                {t("electionItem.position")}: <b>{Number(item.positionsCount) || 0}</b>
              </Text>
            </div>

            {/* <div className="flex items-center gap-2">
              <TeamOutlined className="text-slate-500" />
              <Text className="text-[15px] text-slate-700">
                {t("electionItem.candidate")}: <b>{votedCount}</b>
              </Text>
            </div> */}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2 text-[15px] text-slate-700">
            <ClockCircleFilled />
            <Text className="text-[15px] text-slate-700">
              {status.key === "ended"
                ? t("electionItem.endTime")
                : t("electionItem.time")}
            </Text>
            <Text className="text-[15px] font-medium text-slate-800">
              {status.key === "ended"
                ? endDateTime
                : `${startDateTime} - ${endDateTime}`}
            </Text>
          </div>

          <div className="shrink-0">
            {detailPath && (
              <Button
                type="primary"
                href={detailPath(item.address)}
                className="h-11 min-w-32 rounded-lg px-6 font-semibold bg-blue-900! hover:bg-blue-800!"
              >
                {t("common.details")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ElectionItem