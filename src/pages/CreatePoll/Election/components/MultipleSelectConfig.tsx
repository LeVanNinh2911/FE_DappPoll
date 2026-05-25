/* eslint-disable @typescript-eslint/no-explicit-any */

import { Select, Switch, InputNumber } from "antd"
import type { FC } from "react"

export type MultiType = "unlimited" | "exact" | "range"

interface Props {
  enabled: boolean
  type: MultiType
  min?: number
  max?: number

  onChange: (data: {
    enabled: boolean
    type?: MultiType
    min?: number
    max?: number
  }) => void
}

const MultipleSelectConfig: FC<Props> = ({
  enabled,
  type,
  min = 0,
  max = 0,
  onChange
}) => {
  return (
    <div className="mt-2 ">
      {/* SWITCH */}
      <div className=" items-center justify-between">
        <span className="text-gray-600 mr-5">
          Cho phép chọn nhiều
        </span>

        <Switch
          checked={enabled}
          onChange={(checked) => {
            onChange({ enabled: checked })
          }}
        />
      </div>

      {/* CONFIG */}
      {enabled && (
        <div className="mt-3 flex items-center gap-2">
          <Select
            value={type}
            onChange={(val) => onChange({ enabled, type: val })}
            className="w-40 py-1.5! px-3! "
            options={[
              { value: "unlimited", label: <p className="text-gray-500">Không giới hạn</p> },
              { value: "exact", label: <p className="text-gray-500">Cố định</p> },
              { value: "range", label: <p className="text-gray-500">Khoảng</p> }
            ]}
          />

          {type === "exact" && (
            <InputNumber
              className="py-0.5!"
              min={1}
              value={min}
              onChange={(val) =>
                onChange({ enabled, type, min: val || 0 })
              }
            />
          )}

          {type === "range" && (
            <>
              <InputNumber
                className="py-0.5!"
                min={0}
                value={min}
                placeholder="Min"
                onChange={(val) =>
                  onChange({ enabled, type, min: val || 0 })
                }
              />
              <InputNumber
                className="py-0.5!"
                min={0}
                value={max}
                placeholder="Max"
                onChange={(val) =>
                  onChange({ enabled, type, max: val || 0 })
                }
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default MultipleSelectConfig