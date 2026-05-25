/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  AreaChartOutlined,
  ArrowRightOutlined,
  UserSwitchOutlined
} from "@ant-design/icons"

import {
  Button,
  Card,
  Empty,
  Spin
} from "antd"

import {
  useEffect,
  useMemo,
  useState,
  type FC
} from "react"

import { useParams } from "react-router-dom"

import useAppWallet from "../../../hooks/useAppWallet"
import { useWriteTxWithConfirm } from "../../../hooks/useWriteTxWithConfirm"

import { readVoter } from "../../../components/readContract"

import { usePositionData } from "../Election/hooks/usePositionData"

import { useVoteAllocation } from "./hooks/useVoteAllocation"

import { useCompanyVoteAction } from "./hooks/useCompanyVoteAction"

import VotingPowerSummary from "./components/VotingPowerSummary"

import CandidateAllocationCard from "./components/CandidateAllocationCard"

import ConfirmCompanyVoteModal from "./components/ConfirmCompanyVoteModal"

import VoteSuccessModal from "../Election/components/VoteSuccessModal"

interface Props {
  position: any
  election: any
  isEnded: boolean
  isNotStarted: boolean
  reloadElection: () => Promise<void>
  setResultPosition: (position: any) => void
  setDelegatePosition: (id: number) => void
  isCreator: boolean
  isPrivate: boolean
}

const PositionItemCompany: FC<Props> = ({
  position,
  isEnded,
  isNotStarted,
  reloadElection,
  setResultPosition,
  setDelegatePosition,
  isCreator,
  isPrivate
}) => {

  const { address } = useParams()

  const {
    addressWallet,
    walletType,
    privyWallet
  } = useAppWallet()

  const { writeTx } = useWriteTxWithConfirm()

  const [openConfirm, setOpenConfirm] = useState(false)

  const [openSuccess, setOpenSuccess] = useState(false)

  const [voterData, setVoterData] = useState<any>(null)

  const [loadingVoter, setLoadingVoter] = useState(true)

  // LOAD VOTER
  useEffect(() => {

    const fetchVoter = async () => {

      if (!addressWallet || !address) {
        setLoadingVoter(false)
        return
      }

      try {

        setLoadingVoter(true)

        const voter = await readVoter(
          address as `0x${string}`,
          position.id,
          addressWallet
        )

        setVoterData(voter)

      } catch (err) {

        console.error("Lỗi lấy dữ liệu cử tri:", err)

      } finally {

        setLoadingVoter(false)

      }

    }

    fetchVoter()

  }, [address, addressWallet, position.id])

  const {
    candidatesData,
    loadingCandidates,
    t
  } = usePositionData(position)

  const totalVotingPower = Number(
    voterData?.totalVotingPower || 0
  )

  const canVote =
    !isPrivate ||
    isCreator ||
    Number(voterData?.shares || 0) > 0

  const hasVoted = Boolean(voterData?.voted)

  const {
    allocations,
    allocationArray,
    usedVotes,
    remainingVotes,
    isValidAllocation,
    setVote,
    resetAllocations
  } = useVoteAllocation({
    positionId: position.id,
    totalVotingPower,
    t,
    isBlocked: !canVote || hasVoted
  })

  // AFTER VOTED
  const displayUsedVotes = hasVoted
    ? totalVotingPower
    : usedVotes

  const displayRemainingVotes = hasVoted
    ? 0
    : remainingVotes

  const { handleVote } = useCompanyVoteAction({
    address: address as `0x${string}`,
    positionId: position.id,
    allocations: allocationArray,
    totalVotingPower,
    addressWallet,
    walletType,
    privyWallet,
    writeTx,
    reloadElection,
    t,
    onSuccess: async () => {

      setOpenConfirm(false)

      setOpenSuccess(true)

      // UPDATE UI AFTER SUCCESS
      setVoterData((prev: any) => ({
        ...prev,
        voted: true
      }))

      resetAllocations()

      await reloadElection()

    }
  })

  const allocationPreview = useMemo(() => {
    return allocationArray.map((a) => ({
      candidate: candidatesData[a.candidateId],
      votes: a.votes
    }))
  }, [allocationArray, candidatesData])

  const votingDisabled =
    isEnded ||
    isNotStarted ||
    hasVoted ||
    !canVote

  if (loadingVoter) {
    return (
      <Card className="mt-3 rounded-2xl">
        <div className="flex justify-center py-12">
          <Spin />
        </div>
      </Card>
    )
  }

  if (!canVote && !isCreator) {
    return (
      <Card className="mt-3 rounded-2xl">
        <Empty description="Bạn không có quyền tham gia bỏ phiếu ở vị trí này" />
      </Card>
    )
  }

  return (
    <>

      <Card
        className="mt-3 rounded-2xl"
        title={
          <div className="flex items-center justify-between">

            <div className="p-3">

              <div className="text-2xl font-bold text-blue-900">
                {position.name}
              </div>

              <div className="mt-1 text-sm text-slate-500">
                Bỏ phiếu cộng dồn cho doanh nghiệp
              </div>

            </div>

            {
              hasVoted && (
                <div
                  className="
                    rounded-full bg-green-100
                    px-4 py-1 text-sm font-medium text-green-700
                  "
                >
                  Đã bỏ phiếu
                </div>
              )
            }

          </div>
        }
      >

        {/* SUMMARY */}
        <VotingPowerSummary
          totalVotingPower={totalVotingPower}
          usedVotes={displayUsedVotes}
          remainingVotes={displayRemainingVotes}
          hasVoted={hasVoted}
        />

        {/* CANDIDATES */}
        {
          loadingCandidates ? (
            <div className="flex justify-center py-10">
              <Spin />
            </div>
          ) : (
            candidatesData.map((candidate, index) => (
              <CandidateAllocationCard
                key={index}
                candidate={{ ...candidate, id: index }}
                allocatedVotes={allocations[index] || 0}
                totalVotesUsed={usedVotes}
                totalVotingPower={totalVotingPower}
                onChangeVotes={setVote}
              />
            ))
          )
        }

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">

          <Button
            type="primary"
            size="large"
            disabled={
              votingDisabled ||
              !isValidAllocation
            }
            onClick={() => {
              setOpenConfirm(true)
            }}
          >
            {t("positionItem.vote")}
            {" "}
            <ArrowRightOutlined />
          </Button>

          <Button
            size="large"
            className="text-blue-900!"
            onClick={() => setResultPosition(position)}
          >
            <AreaChartOutlined />
            {" "}
            {t("positionItem.show_results")}
          </Button>

          <Button
            size="large"
            className="text-blue-900!"
            disabled={votingDisabled}
            onClick={() => setDelegatePosition(position.id)}
          >
            <UserSwitchOutlined />
            {" "}
            {t("positionItem.delegate")}
          </Button>

        </div>

      </Card>

      {/* CONFIRM */}
      <ConfirmCompanyVoteModal
        open={openConfirm}
        onConfirm={handleVote}
        onCancel={() => setOpenConfirm(false)}
        allocations={allocationPreview}
        totalVotingPower={totalVotingPower}
        usedVotes={usedVotes}
        remainingVotes={remainingVotes}
        title={position.name}
      />

      {/* SUCCESS */}
      <VoteSuccessModal
        open={openSuccess}
        onClose={() => setOpenSuccess(false)}
        position={position}
      />

    </>
  )
}

export default PositionItemCompany