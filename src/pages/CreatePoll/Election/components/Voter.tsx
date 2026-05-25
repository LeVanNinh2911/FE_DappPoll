import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Divider, Input } from "antd"
import type { PositionInput } from "../styles"
import { type FC, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"

interface Props {
  position: PositionInput
  handleUpdatePos: (index: number, data: Partial<PositionInput>) => void
  i: number
  scrollTarget: {
    positionIndex: number
    voterIndex: number
  } | null
  clearScrollTarget: () => void
  onAddVoter: (index: number) => void,
  pollType: number
}

const Voter: FC<Props> = ({
  position,
  handleUpdatePos,
  i,
  scrollTarget,
  clearScrollTarget,
  onAddVoter,
  pollType,
}) => {
  const voterRefs = useRef<Array<HTMLDivElement | null>>([])
  const { t } = useTranslation()

  useEffect(() => {
    if (!scrollTarget) return
    if (scrollTarget.positionIndex !== i) return

    const targetEl = voterRefs.current[scrollTarget.voterIndex]

    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
      clearScrollTarget()
    }
  }, [position.voters.length, scrollTarget, i, clearScrollTarget])

  return (
    <div className="w-4/5">
      <Divider />
      <b>
        <p className="mb-2">{t("voter.voters")}</p>
      </b>

      {position.voters.map((voter, index) => (
        <div className="mb-3 items-center">
          <div
            key={index}
            ref={(el) => {
              voterRefs.current[index] = el
            }}
            className="relative md:w-4/5 md:mr-5"
          >
            <div className="relative mb-3 flex items-center gap-2 ">
              <Input
                value={voter.addressWallet}
                required
                className="flex-1 rounded-lg border border-gray-200 px-3! py-2! shadow-sm focus:border-blue-500"
                placeholder={t("voter.walletAddressPlaceholder")}
                onChange={(e) => {
                  const list = [...position.voters]
                  list[index].addressWallet = e.target.value as `0x${string}`
                  handleUpdatePos(i, {
                    voters: list
                  })
                }}
              />

              <button
                type="button"
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  handleUpdatePos(i, {
                    voters: position.voters.filter((_, x) => x !== index)
                  })
                }}
              >
                <CloseOutlined />
              </button>

            </div>

          </div>
          {pollType === 1 &&
            <div>Số cổ phần nắm dữ
              <Input
                value={voter.shares}
                required
                placeholder="0"
                className="w-20! mx-2!" 
                onChange={(e) => {
                  const list = [...position.voters]
                  list[index] = {
                    ...list[index],
                    shares: Number(e.target.value)
                  }
                  handleUpdatePos(i, {
                    voters: list
                  })
                }}
              />

            </div>
          }
        </div>

      ))}

      <Button
        type="dashed"
        block
        icon={<PlusOutlined className="hover:text-blue-900!"/>}
        onClick={() => onAddVoter(i)}
        className="rounded-lg! h-9! text-gray-500! hover:text-blue-900! md:w-4/5!"
        
      >
        {t("voter.addVoter")}
      </Button>
      <Divider/>
    </div>
  )
}

export default Voter