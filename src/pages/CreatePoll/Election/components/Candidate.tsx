/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CloseOutlined,
  DeleteOutlined,
  FileImageOutlined,
  LoadingOutlined,
  WarningOutlined
} from "@ant-design/icons"
import { Input, Tooltip } from "antd"
import { type FC, useEffect, useRef, useState } from "react"
import type { PositionInput } from "../styles"
import { uploadFileToIPFS } from "../../../../config/ipfs"
import { useTranslation } from "react-i18next"
import MultipleSelectConfig from "./MultipleSelectConfig"

interface Props {
  position: PositionInput
  handleUpdatePos: (index: number, data: Partial<PositionInput>) => void
  i: number
  scrollTarget: {
    positionIndex: number
    candidateIndex: number
  } | null
  clearScrollTarget: () => void,
  pollType: number
}

const Candidate: FC<Props> = ({
  position,
  handleUpdatePos,
  i,
  scrollTarget,
  clearScrollTarget,
  pollType,
}) => {
  const { t } = useTranslation()

  const candidateRefs = useRef<Array<HTMLDivElement | null>>([])
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({})
  const isMultiple = position.voteType === 1

  useEffect(() => {
    if (!scrollTarget) return
    if (scrollTarget.positionIndex !== i) return

    const targetEl = candidateRefs.current[scrollTarget.candidateIndex]

    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
      clearScrollTarget()
    }
  }, [position.candidates.length, scrollTarget, i, clearScrollTarget])

  const updateCandidateField = (
    candidateIndex: number,
    field: "name" | "decription" | "image" | "errors" | "imported",
    value: any
  ) => {
    const list = [...position.candidates]
    list[candidateIndex] = {
      ...list[candidateIndex],
      [field]: value
    }

    handleUpdatePos(i, { candidates: list })
  }

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    candidateIndex: number
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    let previewUrl = ""

    try {
      setUploadingIndex(candidateIndex)

      previewUrl = URL.createObjectURL(file)

      const tempList = [...position.candidates]
      tempList[candidateIndex] = {
        ...tempList[candidateIndex],
        image: previewUrl,
        imported: false
      }

      handleUpdatePos(i, {
        candidates: tempList
      })

      const ipfsUrl = await uploadFileToIPFS(file)

      const finalList = [...tempList]
      finalList[candidateIndex] = {
        ...finalList[candidateIndex],
        image: ipfsUrl
      }

      handleUpdatePos(i, {
        candidates: finalList
      })

      setBrokenImages((prev) => ({
        ...prev,
        [candidateIndex]: false
      }))
    } catch (err) {
      console.error("Upload image error:", err)
    } finally {
      setUploadingIndex(null)
      e.target.value = ""

      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }

  const getImageUrl = (url: string) => {
    if (!url) return ""
    if (url.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
    }
    return url
  }

  const handleDeleteCandidate = (candidateIndex: number) => {
    if (position.candidates.length === 1) {
      handleUpdatePos(i, {
        candidates: [{ name: "", decription: "", image: "" }]
      })
      return
    }

    handleUpdatePos(i, {
      candidates: position.candidates.filter((_, x) => x !== candidateIndex)
    })
  }

  return (
    <>
      <div className="my-3">
        <b className="pr-3">{t("candidate.candidates")}</b>
        {pollType === 0 &&
          <MultipleSelectConfig
            enabled={isMultiple}
            type={position.multiType || "unlimited"}
            min={position.minSelect || 0}
            max={position.maxSelect || 0}
            onChange={(data) => {
              handleUpdatePos(i, {
                voteType: data.enabled ? 1 : 0,
                multiType: data.type ?? position.multiType,
                minSelect: data.min ?? position.minSelect,
                maxSelect: data.max ?? position.maxSelect
              })
            }}
          />
        }
        {pollType === 1 &&
          <>
            <p>Chọn ra
              <Input 
                value = {position.seats}
                required 
                placeholder="0"
                className="w-10! mx-2!"
                onChange={(e) => {
                  handleUpdatePos(i, {
                    seats: Number(e.target.value),
                  })
                }}
              /> 
              ứng viên
            </p>
          </>
        }
      </div>

      {position.candidates.map((candidate, index) => {
        const hasErrors = !!candidate.errors?.length
        const imageUrl = getImageUrl(candidate.image)
        const showImage = !!candidate.image && !brokenImages[index]

        return (
          <div
            key={index}
            ref={(el) => {
              candidateRefs.current[index] = el
            }}
            className="relative shadow-xs"
          >
            <div
              className={`mb-5 flex gap-4 rounded-xl border p-6.5 transition ${
                hasErrors
                  ? "border-red-300 bg-red-50/40"
                  : "border-gray-300"
              }`}
            >
              {/* IMAGE */}
              <div className="relative">
                <input
                  type="file"
                  id={`icon-upload-${i}-${index}`}
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, index)}
                />

                {showImage ? (
                  <div className="group relative">
                    <img
                      src={imageUrl}
                      alt={
                        candidate.name ||
                        `${t("candidate.candidate")} ${index + 1}`
                      }
                      className="h-32 w-28 rounded-xl border border-gray-200 object-cover"
                      onError={() => {
                        setBrokenImages((prev) => ({
                          ...prev,
                          [index]: true
                        }))
                      }}
                    />

                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition group-hover:opacity-100">
                      {uploadingIndex === index ? (
                        <LoadingOutlined style={{ color: "white" }} />
                      ) : (
                        <div className="flex items-center gap-3">
                          <label
                            htmlFor={`icon-upload-${i}-${index}`}
                            className="cursor-pointer text-lg text-white"
                          >
                            <FileImageOutlined />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              updateCandidateField(index, "image", "")
                              setBrokenImages((prev) => ({
                                ...prev,
                                [index]: false
                              }))
                            }}
                            className="text-lg text-white"
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor={`icon-upload-${i}-${index}`}
                    className="
                      flex h-32 w-28 cursor-pointer flex-col items-center
                      justify-center rounded-xl border border-gray-200
                      bg-gray-100 hover:bg-gray-200
                    "
                  >
                    {uploadingIndex === index ? (
                      <LoadingOutlined />
                    ) : (
                      <>
                        <FileImageOutlined />
                        <span className="mt-2 text-[11px] text-gray-500">
                          {t("candidate.upload")}
                        </span>
                      </>
                    )}
                  </label>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder={`${t("candidate.candidate")} ${index + 1}`}
                    className={`h-10 shadow-xs ${
                      hasErrors ? "border-red-300" : ""
                    }`}
                    style={{ marginBottom: 10 }}
                    value={candidate.name}
                    onChange={(e) => {
                      const list = [...position.candidates]
                      list[index] = {
                        ...list[index],
                        name: e.target.value,
                        errors: []
                      }
                      handleUpdatePos(i, { candidates: list })
                    }}
                  />

                  {hasErrors && (
                    <Tooltip
                      title={
                        <div>
                          {candidate.errors?.map((err, idx) => (
                            <div key={idx}>• {err}</div>
                          ))}
                        </div>
                      }
                    >
                      <WarningOutlined className="text-lg text-red-500" />
                    </Tooltip>
                  )}
                </div>

                <Input.TextArea
                  placeholder={t("candidate.description")}
                  className={`mt-2 shadow-xs ${
                    hasErrors ? "border-red-300" : ""
                  }`}
                  rows={3}
                  value={candidate.decription}
                  onChange={(e) => {
                    updateCandidateField(index, "decription", e.target.value)
                  }}
                />

                {hasErrors && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    <div className="mb-1 font-medium">
                      {t("candidate.importedDataIssue")}
                    </div>
                    <ul className="list-disc space-y-1 pl-5">
                      {candidate.errors?.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* DELETE */}
            <button
              type="button"
              className="absolute right-2.5 top-1.5 text-gray-400 hover:text-gray-600"
              onClick={() => handleDeleteCandidate(index)}
            >
              <CloseOutlined />
            </button>
          </div>
        )
      })}
    </>
  )
}

export default Candidate