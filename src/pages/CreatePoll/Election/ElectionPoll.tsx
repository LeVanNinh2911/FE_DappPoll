/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "antd"
import { CloseOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons"
import { forwardRef, useImperativeHandle } from "react"

import type { PositionInput } from "./styles"
import Candidate from "./components/Candidate"
import Voter from "./components/Voter"
import { useElectionPoll } from "./hooks/useElectionPoll"

export interface ElectionPollRef {
  createElection: (values: any) => Promise<void>
}

interface Props {
  privacy: boolean,
  pollType : number
}

const ElectionPoll = forwardRef<ElectionPollRef, Props>(({ privacy , pollType}, ref) => {
  const {
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
    clearCandidateScrollTarget,
    clearVoterScrollTarget
  } = useElectionPoll({ privacy,pollType })

  useImperativeHandle(ref, () => ({
    createElection
  }))

  return (
    <>
      <div className="mt-3 mb-4 flex flex-wrap items-center justify-between gap-3">
        <b>{t("electionPoll.positionOptions")}</b>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={handleImportExcel}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="
              rounded-lg border border-green-300 p-2 px-4
              text-green-600 shadow-sm
              hover:border-green-500 hover:text-green-700
              disabled:opacity-60
            "
          >
            <UploadOutlined />{" "}
            {importing
              ? t("electionPoll.importing")
              : t("electionPoll.importExcel")}
          </button>
        </div>
      </div>

      {positions.map((position: PositionInput, i: number) => (
        <div
          key={i}
          ref={(el) => {
            positionRefs.current[i] = el
          }}
          className="
            relative mt-3 w-full rounded-xl border
            border-gray-300 p-5 shadow-xs
          "
        >
          <div>
            <b>
              {t("electionPoll.positionLabel")} #{i + 1}
            </b>

            <button
              type="button"
              className="
                absolute right-1 top-1 rounded-sm
                px-2.5 py-1.5 text-mist-500 hover:bg-mist-100
              "
              onClick={() => handleRemovePosition(i)}
            >
              <CloseOutlined />
            </button>

            <div className="mt-3 space-y-3">
              <Input
                placeholder={`${t("electionPoll.positionPlaceholder")} ${i + 1}`}
                className="h-10 shadow-xs"
                value={position.name}
                onChange={(e) =>
                  handleUpdatePos(i, {
                    name: e.target.value
                  })
                }
              />
            </div>
          </div>

          <div
            className="overflow-x-hidden overflow-y-auto md:px-2"
            style={{
              maxHeight: privacy ? 700 : 550
            }}
          >
            <Candidate
              position={position}
              handleUpdatePos={handleUpdatePos}
              i={i}
              scrollTarget={candidateScrollTarget}
              clearScrollTarget={clearCandidateScrollTarget}
              pollType = {pollType}
            />

            {privacy && (
              <Voter
                position={position}
                handleUpdatePos={handleUpdatePos}
                i={i}
                scrollTarget={voterScrollTarget}
                clearScrollTarget={clearVoterScrollTarget}
                onAddVoter={handleAddVoter}
                pollType = {pollType}
              />
            )}
          </div>

          <button
            type="button"
            className="
              w-38 rounded-lg border border-gray-300 p-2
              text-gray-500 shadow-sm
              hover:border-blue-400 hover:text-blue-400
            "
            onClick={() => handleAddCandidate(i)}
          >
            <PlusOutlined /> {t("electionPoll.addCandidate")}
          </button>
        </div>
      ))}

      <button
        className="
          float-right my-4 w-35 rounded-lg border
          border-gray-300 p-2 text-gray-500 shadow-sm
          hover:border-blue-400 hover:text-blue-400
        "
        type="button"
        onClick={handleAddPosition}
      >
        <PlusOutlined /> {t("electionPoll.addPosition")}
      </button>
    </>
  )
})

export default ElectionPoll