import { Select } from "antd"
import type { FC } from "react"
import { useTranslation } from "react-i18next"

interface Props {
  typeResult: number
  onChange: (value: number) => void
}

const Settings: FC<Props> = ({ typeResult, onChange }) => {
  const { t } = useTranslation()

  const itemsResult = [
    {
      value: 0,
      label: <p className="text-gray-500 flex gap-2">{t("always_public")}</p>,
    },
    {
      value: 1,
      label: <p className="text-gray-500 flex gap-2">{t("public_after_end_date")}</p>,
    },
    {
      value: 2,
      label: <p className="text-gray-500 flex gap-2">{t("public_after_vote")}</p>,
    },
  ]

  return (
    <div className="mb-5">
      <p className="font-extrabold text-lg">{t("settings")}</p>

      <div className="flex items-center">
        <div className="md:w-3/7 w-full mt-3">
          <p className="font-light mb-2">{t("results_visibility")}</p>

          <Select
            style={{ height: 40, width: "100%" }}
            value={typeResult}
            options={itemsResult}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  )
}

export default Settings