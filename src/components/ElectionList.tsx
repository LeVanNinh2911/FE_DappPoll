{/* eslint-disable @typescript-eslint/no-explicit-any */}

import { useEffect, useMemo, useState, type FC } from "react"
import {
  Empty,
  Input,
  Pagination,
  Spin,
  Typography,
  notification,
  Segmented,
  Row,
  Col
} from "antd"
import { SearchOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import type { ElectionInfoItem } from "../types/types"
import ElectionItem from "./ElectionItem"
import { useTranslation } from "react-i18next"
import { readElectionInfo } from "./readContract"

const { Text } = Typography

type Props = {
  addresses: `0x${string}`[]
  loading: boolean
  emptyText: string
  errorText: string
  detailPath?: (address: `0x${string}`) => string
}

const PAGE_SIZE = 6

type FilterKey = "all" | "ongoing" | "upcoming" | "ended"

const ElectionList: FC<Props> = ({
  addresses,
  loading,
  emptyText,
  errorText,
  detailPath
}) => {
  const { t } = useTranslation()
  const [items, setItems] = useState<ElectionInfoItem[]>([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<FilterKey>("all")

  useEffect(() => {
    const loadElectionInfos = async () => {
      if (!addresses.length) {
        setItems([])
        return
      }

      try {
        setDetailLoading(true)

        const results = await Promise.all(
          addresses.map(async (electionAddress) => {
            return readElectionInfo(electionAddress)
          })
        )

        results.sort((a, b) => b.startTime - a.startTime)
        setItems(results)
      } catch (error) {
        notification.error({
          message: errorText,
          placement: "bottomRight"
        })
        console.log(error)
      } finally {
        setDetailLoading(false)
      }
    }

    loadElectionInfos()
  }, [addresses, errorText])

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    const now = dayjs().unix()

    return items.filter((item) => {
      const title = item.title?.toLowerCase() ?? ""
      const description = item.description?.toLowerCase() ?? ""

      const matchesKeyword =
        !keyword || title.includes(keyword) || description.includes(keyword)

      let matchesFilter = true
      const start = Number(item.startTime)
      const end = Number(item.endTime)

      if (filter === "ongoing") matchesFilter = now >= start && now <= end
      else if (filter === "upcoming") matchesFilter = now < start
      else if (filter === "ended") matchesFilter = now > end

      return matchesKeyword && matchesFilter
    })
  }, [items, search, filter])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, filter])

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredItems.slice(start, end)
  }, [filteredItems, currentPage])

  if (loading || detailLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Spin size="large" />
        <Text className="text-gray-400">{t("electionList.loadingData")}</Text>
      </div>
    )
  }

  return (
    <div>
      {/* SEARCH + FILTER */}
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex-1">
          <Input
            size="large"
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined />}
            placeholder={t("electionList.searchPlaceholder")}
            className="h-12 rounded-2xl"
          />
        </div>

        <Segmented
          size="large"
          value={filter}
          onChange={(value) => setFilter(value as FilterKey)}
          options={[
            { label: t("electionList.all"), value: "all" },
            { label: t("electionItem.ongoing"), value: "ongoing" },
            { label: t("electionItem.upcoming"), value: "upcoming" },
            { label: t("electionItem.ended"), value: "ended" }
          ]}
          className="text-blue-900!"
        />
      </div>

      {/* EMPTY */}
      {!paginatedItems.length ? (
        <div className="rounded-2xl border border-dashed py-14">
          <Empty
            description={search.trim() ? t("electionList.noResults") : emptyText}
          />
        </div>
      ) : (
        <>
          {/* GRID */}
          <Row gutter={[16, 16]}>
            {paginatedItems.map((item) => (
              <Col key={item.address} xs={24} md={12}>
                <ElectionItem item={item} detailPath={detailPath} />
              </Col>
            ))}
          </Row>

          {/* PAGINATION */}
          {filteredItems.length > PAGE_SIZE && (
            <div className="mt-8 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={PAGE_SIZE}
                total={filteredItems.length}
                showSizeChanger={false}
                onChange={(page) => setCurrentPage(page)}
                className="text-blue-900!"
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ElectionList