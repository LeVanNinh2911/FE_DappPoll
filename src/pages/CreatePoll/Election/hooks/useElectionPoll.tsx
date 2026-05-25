/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from "antd"
import { createContext, useEffect, useRef, useState } from "react"
import { useChainId, useWriteContract } from "wagmi"
import dayjs from "dayjs"
import { watchContractEvent } from "@wagmi/core"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import type { PositionInput } from "../styles"
import {
  importCandidatesFromExcel,
  type ImportedPosition
} from "../../../../services/aiImport"
import { ELECTION_CONTRACTS } from "../../../../config/addressContract"
import { config, trustkeys } from "../../../../config/config"
import { ElectionFactoryABI } from "../../../../config/ElectionPollABI"
import { uploadJSONToIPFS } from "../../../../config/ipfs"
import useAppWallet from "../../../../hooks/useAppWallet"
import { privyWriteContract } from "../../../../hooks/privyWriteContract"
import { ElectionCompanyFactoryABI } from "../../../../config/ElectionCompanyABIs"

export const createEmptyPosition = (
  privacy: boolean,
  pollType: number,
  address?: `0x${string}`,
  
): PositionInput => ({
  name: "",
  description: "",

  // 0 = single
  // 1 = multiple
  voteType: pollType === 1 ? 1 : 0,

  multiType: "unlimited",

  minSelect: 0,
  maxSelect: 0,

  // cumulative voting
  seats: pollType === 1 ? 1 : undefined,

  candidates: [
    { name: "", decription: "", image: "" },
    { name: "", decription: "", image: "" }
  ],

  voters:
    address && privacy
      ? [
          {
            addressWallet: "" as `0x${string}`,
            name: "",
            shares: pollType === 1 ? 1 : undefined
          }
        ]
      : []
})

interface UseElectionPollProps {
  privacy: boolean,
  pollType:number
}

export const ElectionPollContext = createContext({})

export const useElectionPoll = ({ privacy, pollType }: UseElectionPollProps) => {
  const { t } = useTranslation()

  const { addressWallet, isConnected, walletType, privyWallet } = useAppWallet()
  const writeContract = useWriteContract()
  const chainId = useChainId()
  const contractInfo = ELECTION_CONTRACTS[chainId]
  const navigate = useNavigate()

  const [positions, setPositions] = useState<PositionInput[]>([
    createEmptyPosition(privacy, pollType, addressWallet)
  ])

  const [importing, setImporting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [candidateScrollTarget, setCandidateScrollTarget] = useState<{
    positionIndex: number
    candidateIndex: number
  } | null>(null)

  const [voterScrollTarget, setVoterScrollTarget] = useState<{
    positionIndex: number
    voterIndex: number
  } | null>(null)

  const positionRefs = useRef<Array<HTMLDivElement | null>>([])

  const scrollToPosition = (index: number) => {
    requestAnimationFrame(() => {
      positionRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    })
  }

  const handleUpdatePos = (index: number, data: Partial<PositionInput>) => {
    setPositions((prev) => {
      const listPos = [...prev]
      listPos[index] = { ...listPos[index], ...data }
      return listPos
    })
  }

  const handleAddPosition = () => {
    setPositions((prev) => {
      const newPositions = [...prev, createEmptyPosition(privacy,pollType, addressWallet)]
      const newIndex = newPositions.length - 1

      setTimeout(() => {
        scrollToPosition(newIndex)
      }, 0)

      return newPositions
    })
  }

  const handleRemovePosition = (index: number) => {
    setPositions((prev) => {
      if (prev.length === 1) {
        return [createEmptyPosition(privacy,pollType, addressWallet)]
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleAddCandidate = (index: number) => {
    setPositions((prev) => {
      const listPos = [...prev]
      const newCandidateIndex = listPos[index].candidates.length

      listPos[index] = {
        ...listPos[index],
        candidates: [
          ...listPos[index].candidates,
          { name: "", decription: "", image: "" }
        ]
      }

      setCandidateScrollTarget({
        positionIndex: index,
        candidateIndex: newCandidateIndex
      })

      return listPos
    })
  }

  const handleAddVoter = (index: number) => {
    setPositions((prev) => {
      const listPos = [...prev]
      const newVoterIndex = listPos[index].voters.length

      listPos[index] = {
        ...listPos[index],
        voters: [
          ...listPos[index].voters,
          {
            name: "",
            addressWallet: `0x${""}`,
            shares: pollType === 1 ? 1 : undefined
          }
        ]
      }

      setVoterScrollTarget({
        positionIndex: index,
        voterIndex: newVoterIndex
      })

      

      return listPos
    })
  }

  const mapImportedPositionsToState = (
    importedPositions: ImportedPosition[]
  ): PositionInput[] => {
    const mapped = importedPositions.map((position) => ({
      name: position.positionName || "",
      description: position.positionDescription || "",
      voteType: position.positionVoteType || 0,
      
      candidates:
        position.candidates.length > 0
          ? position.candidates.map((candidate) => ({
              name: candidate.name || "",
              decription: candidate.description || "",
              image: candidate.image || ""
            }))
          : [{ name: "", decription: "", image: "" }],
      voters: privacy && addressWallet ? [{ addressWallet, name: "" }] : []
    }))

    return mapped.length > 0
      ? mapped
      : [createEmptyPosition(privacy,pollType, addressWallet)]
  }

  const handleImportExcel = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setImporting(true)

      const result = await importCandidatesFromExcel(file)

      if (!result.success || !result.positions?.length) {
        notification.error({
          message: t("electionHook.importFailedTitle"),
          description:
            result.message || t("electionHook.noCandidateDataFound"),
          placement: "bottomRight"
        })
        return
      }

      const mappedPositions = mapImportedPositionsToState(result.positions)
      setPositions(mappedPositions)

      notification.success({
        message: t("electionHook.importSuccessTitle"),
        description: t("electionHook.importSuccessDescription", {
          candidates: result.totalCandidates ?? 0,
          positions: result.totalPositions ?? 0
        }),
        placement: "bottomRight"
      })

      setTimeout(() => {
        scrollToPosition(0)
      }, 100)
    } catch (error: any) {
      console.error("Import Excel error:", error)

      notification.error({
        message: t("electionHook.importFailedTitle"),
        description:
          error?.response?.data?.message ||
          error?.message ||
          t("electionHook.unableToImportExcelFile"),
        placement: "bottomRight"
      })
    } finally {
      setImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  useEffect(() => {
    if (!contractInfo?.address || !contractInfo?.addressCompany ) return

    const unwatch = watchContractEvent(config, {
      address: pollType === 0 ? contractInfo.address : contractInfo.addressCompany,
      abi: pollType === 0 ? ElectionFactoryABI : ElectionCompanyFactoryABI,
      eventName: "ElectionCreated",
      onLogs(logs: any) {
        const createdElectionAddress = logs?.[0]?.args?.electionAddress

        if (createdElectionAddress) {
          notification.success({
            message: t("electionHook.createdSuccessfullyTitle"),
            description: t("electionHook.createdSuccessfullyDescription"),
            placement: "bottomRight"
          })

          setPositions([createEmptyPosition(privacy,pollType, addressWallet)])
          navigate(`/election/${createdElectionAddress}`)
        }
      }
    })

    return () => unwatch()
  }, [contractInfo?.address,contractInfo?.addressCompany, navigate, privacy, addressWallet, t,pollType])

  const createElection = async (values: any) => {
    try {
      if (!isConnected || !addressWallet) {
        notification.warning({
          message: t("electionHook.walletRequiredTitle"),
          description:
            t("electionHook.walletRequiredDescription") ||
            "Please connect wallet before creating election.",
          placement: "bottomRight"
        })
        return
      }

      if (!contractInfo?.address) {
        notification.error({
          message: t("electionHook.createFailedTitle"),
          description: "Election factory contract is not configured.",
          placement: "bottomRight"
        })
        return
      }

      const startTime = BigInt(dayjs(values.time[0]).unix())
      const endTime = BigInt(dayjs(values.time[1]).unix())

      const listPosition = await Promise.all(
        positions.map(async (p) => {
          const isCumulative = pollType === 1
          const isMultiple = p.voteType === 1

          let minSelect = 1
          let maxSelect = 1
          let seats = 1

          if (isMultiple ) {
            if (p.multiType === "unlimited") {
              minSelect = 1
              maxSelect = p.candidates.length
            }

            if (p.multiType === "exact") {
              minSelect = p.minSelect || 1
              maxSelect = minSelect
            }

            if (p.multiType === "range") {
              minSelect = p.minSelect || 1
              maxSelect = p.maxSelect || p.candidates.length
            }
          }

          if(isCumulative) {
            seats = p.seats || 1

          }

          const candidateCids = await Promise.all(
            p.candidates.map(async (c) => {
              const metadata = {
                name: c.name,
                description: c.decription,
                image: c.image
              }
              return await uploadJSONToIPFS(metadata)
            })
          )

          return [
            p.name,
            BigInt(seats),
            Number(p.voteType),
            BigInt(minSelect),
            BigInt(maxSelect),
            [...candidateCids], 
            [...p.voters.map((v) => v.addressWallet)],
            [...p.voters.map((v) => BigInt(v.shares || 0))]
          ] as const
        })
      )

      console.log(listPosition)
      console.log(pollType)

      const listPositionBasic = listPosition.map((p) => ([
        p[0],
        p[2],
        p[3],
        p[4],
        p[5],
        p[6]
      ]))
      const listPositionCumulative = listPosition.map((p) => ([
        p[0],
        p[1],
        p[5],
        p[6],
        p[7]
      ]))

      console.log(listPositionBasic)
      console.log(listPositionCumulative)

      const electionType = privacy ? 1n : 0n
      const description = values.description ?? ""
      const resultVisibility = values.resultVisibility

      if (walletType === "privy") {
        if (!privyWallet) {
          throw new Error("Privy wallet not found")
        }

        await privyWriteContract({
          wallet: privyWallet,
          address: pollType === 0 ? contractInfo.address : contractInfo.addressCompany,
          abi: pollType === 0 ? ElectionFactoryABI : ElectionCompanyFactoryABI,
          functionName: "createElection",
          args: [
            values.title,
            description,
            startTime,
            endTime,
            electionType,
            pollType === 0 ? listPositionBasic : listPositionCumulative,
            resultVisibility
          ],
          chain: trustkeys
        })
      } else {
        await writeContract.mutateAsync({
          abi: pollType === 0 ? ElectionFactoryABI : ElectionCompanyFactoryABI,
          address: pollType === 0 ? contractInfo.address : contractInfo.addressCompany,
          functionName: "createElection",
          args: [
            values.title,
            description,
            startTime,
            endTime,
            electionType,
            pollType === 0 ? listPositionBasic : listPositionCumulative,
            resultVisibility
          ]
        })
      }

      setPositions([createEmptyPosition(privacy,pollType, addressWallet)])
    } catch (error: any) {
      console.error("createElection error:", error)

      notification.error({
        message: t("electionHook.createFailedTitle"),
        description:
          error?.shortMessage ||
          error?.message ||
          t("electionHook.createFailedDescription"),
        placement: "bottomRight"
      })

    }
  }

  return {
    t,
    positions,
    importing,
    fileInputRef,
    candidateScrollTarget,
    voterScrollTarget,
    positionRefs,
    handleUpdatePos,
    handleAddPosition,
    handleRemovePosition,
    handleAddCandidate,
    handleAddVoter,
    handleImportExcel,
    createElection,
    clearCandidateScrollTarget: () => setCandidateScrollTarget(null),
    clearVoterScrollTarget: () => setVoterScrollTarget(null)
  }
}