/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, notification, Typography } from "antd"
import { useEffect, useState, type FC } from "react"

import { useParams } from "react-router-dom"
import {
  readElectionInfo,
  readPositionList
} from "../../components/readContract"

import Share from "./components/Share"
import DelegateModal from "./components/DelegateModal"
import ResultModal from "./components/ResultModal/ResultModal"
import PositionItem from "./Election/PositionItem"

import { useTranslation } from "react-i18next"
import ElectionDetailsHeader from "./Election/components/Header"
import useAppWallet from "../../hooks/useAppWallet"
import PositionItemCompany from "./ElectionCompany/PositionItemCompany"

const { Title, Text } = Typography

const ElectionDetails: FC = () => {
  const { address } = useParams()
  const { isConnected, addressWallet } = useAppWallet()

  const { t } = useTranslation()

  const [election, setElection] = useState<any>(null)
  const [positions, setPositions] = useState<any[]>([])
  const [delegatePosition, setDelegatePosition] = useState<number | null>(null)
  const [resultPosition, setResultPosition] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState<any>()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const reloadElection = async () => {
    if (!address) return

    const electionAddress = address as `0x${string}`

    const [data, pos] = await Promise.all([
      readElectionInfo(electionAddress),
      readPositionList(electionAddress)
    ])

    setElection(data)
    setPositions(pos)
  }

  useEffect(() => {
    if (!address) return

    let ignore = false
    const electionAddress = address as `0x${string}`

    const fetchElection = async () => {
      try {
        const [data, pos] = await Promise.all([
          readElectionInfo(electionAddress),
          readPositionList(electionAddress)
        ])

        if (ignore) return

            console.log(pos)

        setElection(data)
        setPositions(pos)
      } catch (error) {
        console.error(error)
        if (ignore) return

        notification.error({
          message: t("failedToLoad"),
          placement: "bottomRight"
        })
      }
    }

    fetchElection()

    return () => {
      ignore = true
    }

    
  }, [address, t])

  const isCreator = election?.creator === addressWallet
  const isPrivate = election?.electionType === 1

  const isEnded = election ? currentTime > election.endTime : false
  const isNotStarted = election ? currentTime < election.startTime : false
  
  return (
    <>
      {election && (
        <>
          <Card
            style={{
              maxWidth: 1040,
              margin: "0 auto",
              marginTop: 28,
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid #dbe4ff",
              padding: 0
            }}
            className="shadow-lg!"
            styles={{ body: { padding: 0 } }}
          >
            <ElectionDetailsHeader
              election={election}
              positionsCount={positions.length}
              walletAddress={isConnected}
              currentTime={currentTime}
            />

            {/* Content */}
            <div className="py-5 px-3 md:p-12">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <Title
                    level={4}
                    style={{ margin: 0 }}
                    className="text-blue-900!"
                  >
                    {t("electionDetails.makeAChoice")}
                  </Title>

                  <Text type="secondary">
                    {t("electionDetails.reviewAndVote")}
                  </Text>
                </div>
              </div>

              <div className="flex flex-col gap-5">

                {positions.map((position, index) => {
                  
                  if (position.seats !== null) {
                    return (
                      <PositionItemCompany
                        key={`company-${index}`}
                        position={position}
                        election={election}
                        isEnded={isEnded}
                        isNotStarted={isNotStarted}
                        reloadElection={reloadElection}
                        setResultPosition={
                          setResultPosition
                        }
                        setDelegatePosition={
                          setDelegatePosition
                        }
                        isCreator={isCreator}
                        isPrivate={isPrivate}
                      />
                    );
                  }
                  else{
                    return (
                      <PositionItem
                        key={`basic-${index}`}
                        position={position}
                        isEnded={isEnded}
                        isNotStarted={isNotStarted}
                        reloadElection={reloadElection}
                        election={election}
                        setResultPosition={
                          setResultPosition
                        }
                        setDelegatePosition={
                          setDelegatePosition
                        }
                        isCreator={isCreator}
                        isPrivate={isPrivate}
                      />

                    );
                  }
                })}

              </div>
            </div>
          </Card>

          <Share address={address as `0x${string}`} />

          <DelegateModal
            open={delegatePosition !== null}
            positionId={delegatePosition ?? 0}
            electionAddress={address as `0x${string}`}
            onClose={() => setDelegatePosition(null)}
          />

          <ResultModal
            open={!!resultPosition}
            position={resultPosition}
            electionAddress={address as `0x${string}`}
            onClose={() => setResultPosition(null)}
          />
        </>
      )}
    </>
  )
}

export default ElectionDetails