/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FC, useEffect, useMemo, useState } from "react"
import { Modal, Typography, Spin, Empty } from "antd"
import {
  InboxOutlined,
  BarChartOutlined,
  TeamOutlined,
  RiseOutlined
} from "@ant-design/icons"
import { useChainId, useConnection } from "wagmi"
import { useTranslation } from "react-i18next"
import { readContract } from "@wagmi/core"

import { readCandidates, readElectionInfo, readVoter } from "../../../../components/readContract"
import { getIPFSUrl } from "../../../../config/ipfs"
import { config } from "../../../../config/config"
import { ELECTION_CONTRACTS } from "../../../../config/addressContract"
import { ElectionFactoryABI } from "../../../../config/ElectionPollABI"

import ResultChart from "./ResultChart"
import CandidateRanking from "./CandidateRanking"

const { Title } = Typography

type Props = {
  open: boolean
  onClose: () => void
  electionAddress: `0x${string}`
  position: any
}

const BLUE_PALETTE = ["#1e3a8a", "#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"]

const ResultModal: FC<Props> = ({ open, onClose, electionAddress, position }) => {
  const { address } = useConnection()
  const { t } = useTranslation()
  const chainId = useChainId()

  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [canView, setCanView] = useState(false)
  const [visitStatus, setVisitStatus] = useState(0)

  // const isMultiple = Number(position?.voteType) === 1

  const fetchMetadata = async (cid: string) => {
    const gateways = ["https://ipfs.io/ipfs/", "https://dweb.link/ipfs/"]
    for (const gateway of gateways) {
      try {
        const res = await fetch(gateway + cid)
        if (res.ok) return await res.json()
      } catch (err) {
        console.error(err)
      }
    }
    return null
  }

  useEffect(() => {
    const loadData = async () => {
      if (!position || !open) return
      setLoading(true)

      try {
        const visibility = await readContract(config, {
          address: ELECTION_CONTRACTS[chainId].address,
          abi: ElectionFactoryABI,
          functionName: "getResultVisibility",
          args: [electionAddress]
        })

        let allowed = false

        if (visibility === 0) allowed = true

        if (visibility === 1) {
          const election = await readElectionInfo(electionAddress)
          allowed = Math.floor(Date.now() / 1000) >= election.endTime
          setVisitStatus(1)
        }

        if (visibility === 2) {
          if (address) {
            const voter = await readVoter(electionAddress, position.id, address)
            allowed = voter.voted
          }
          setVisitStatus(2)
        }

        setCanView(allowed)
        if (!allowed) return

        const data = await readCandidates(electionAddress, position.id)
        const list = await Promise.all(
          data.map(async (c: any, index: number) => {
            const meta = await fetchMetadata(c.name)
            return {
              id: index,
              name: meta?.name || "Unknown",
              voteCount: Number(c.voteCount),
              image: meta?.image ? getIPFSUrl(meta.image) : "",
              description: meta?.description || ""
            }
          })
        )

        setCandidates(list)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [open, position, electionAddress, address, chainId])

  const sortedCandidates = useMemo(
    () => [...candidates].sort((a, b) => b.voteCount - a.voteCount),
    [candidates]
  )

  const totalVotes = useMemo(
    () => candidates.reduce((sum, c) => sum + c.voteCount, 0),
    [candidates]
  )

  const winnerVotes = Math.max(...candidates.map((c) => c.voteCount), 0)

  const chartData = useMemo(
    () =>
      sortedCandidates
        .map((c, i) => ({
          name: c.name,
          value: c.voteCount,
          fill: BLUE_PALETTE[i % BLUE_PALETTE.length]
        }))
        .filter((d) => d.value > 0),
    [sortedCandidates]
  )

  const leadingCandidate = sortedCandidates[0]
  const leadingPercent =
    totalVotes > 0 && leadingCandidate ? (leadingCandidate.voteCount / totalVotes) * 100 : 0

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1100}
      centered
      className="result-modal"
      styles={{
        body: {
          padding: 24,
          background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
          borderRadius: 24
        }
      }}
    >
      {loading ? (
        <div className="flex h-105 items-center justify-center">
          <Spin size="large" tip={t("common.loading")} />
        </div>
      ) : !canView ? (
        <div className="rounded-3xl bg-white py-20 text-center shadow-sm">
          <Empty
            image={<InboxOutlined style={{ fontSize: 72, color: "#1e3a8a" }} />}
            description={
              <span className="font-medium text-blue-900">
                {visitStatus < 2
                  ? t("resultModal.resultsAvailableAfterEnd")
                  : t("resultModal.pleaseVoteToSeeResults")}
              </span>
            }
          />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Title level={2} className="mb-2! flex! items-center! gap-3! text-blue-900!">
                  <BarChartOutlined />
                  {position?.name}
                </Title>

                {/* <div className="flex flex-wrap items-center gap-2">
                  <Tag className="rounded-full border-none bg-blue-100 px-4 py-1 text-blue-800">
                    {isMultiple ? t("resultModal.multipleChoice") : t("resultModal.singleChoice")}
                  </Tag>
                </div> */}
              </div>

              <div className="grid grid-cols-2 gap-3 lg:min-w-105">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <TeamOutlined />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {t("resultModal.totalVotes")}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-950">{totalVotes.toLocaleString()}</div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <RiseOutlined />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {t("resultModal.leadingRate")}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-950">{leadingPercent.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <ResultChart
                chartData={chartData}
                totalVotes={totalVotes}
                leadingCandidate={leadingCandidate}
              />
            </div>

            <div className="lg:col-span-7">
              <CandidateRanking
                candidates={sortedCandidates}
                totalVotes={totalVotes}
                winnerVotes={winnerVotes}
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ResultModal