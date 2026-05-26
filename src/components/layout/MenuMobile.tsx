import {
  BarChartOutlined,
  CalendarOutlined,
  CloseOutlined,
  HistoryOutlined
} from "@ant-design/icons"
import { Divider } from "antd"
import { useEffect, useRef, type FC } from "react"
import voteIcon from "../../assets/vote-icon.png"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

interface Props {
  open: boolean
  close: () => void
}

const MenuMobile: FC<Props> = ({ open, close }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const navigation = [
    {
      key: "menuMobile.createPoll",
      icon: <BarChartOutlined style={{ paddingRight: 10 }} />,
      href: "/create-election"
    },
    {
      key: "menuMobile.myPoll",
      icon: <CalendarOutlined style={{ paddingRight: 10 }} />,
      href: "/my-created-poll"
    },
    {
      key: "menuMobile.historyVoted",
      icon: <HistoryOutlined style={{ paddingRight: 10 }} />,
      href: "/my-voted-poll"
    }
  ]

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [open])

  return (
    <dialog
      className="relative left-2.5 m-2 w-full rounded-xl p-2"
      ref={dialogRef}
    >
      <span className="relative flex">
        <a
          className="flex items-center text-2xl font-bold text-blue-900"
          href="/"
        >
          <img className="mr-3 w-25" src={voteIcon} alt={t("common.vote")} />
          ElectionPoll
        </a>

        <button
          className="absolute right-1 top-1 rounded-sm px-2.5 py-1.5 text-mist-500 hover:bg-mist-100"
          onClick={close}
          aria-label={t("common.close")}
        >
          <CloseOutlined />
        </button>
      </span>

      <div className="m-3 rounded-2xl">
        <div>
          {navigation.map((item, index) => {
            return (
              <button
                key={index}
                className="w-full py-3 text-start text-lg text-gray-700 hover:bg-mist-50 hover:text-blue-900 md:ml-2"
                onClick={() => {
                  navigate(item.href)
                  close()
                }}
              >
                {item.icon}
                {t(item.key)}
              </button>
            )
          })}
        </div>

        <Divider />

        <div className="grid grid-cols-2 gap-y-2">
          <p>{t("menuMobile.helpCenter")}</p>
          <p>{t("menuMobile.guides")}</p>
          <p>{t("menuMobile.faq")}</p>
          <p>{t("menuMobile.about")}</p>
        </div>

        <div className="mt-5 w-full rounded-lg bg-blue-900 p-2 text-white hover:bg-blue-800">
          <a
            href="/connect-wallet"
            className="ml-1 text-while flex justify-center "
          >
            {t("menuMobile.connectWallet")}
          </a>
        </div>
      </div>
    </dialog>
  )
}

export default MenuMobile