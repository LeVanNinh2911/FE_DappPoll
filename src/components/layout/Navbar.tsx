import { useState, type FC } from "react"
import { MenuOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import ConnectWallet from "../ConnectWallet"
import MenuMobile from "./MenuMobile"
import voteIcon from "../../assets/vote-icon.png"

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

const Navbar: FC = () => {
  const { t } = useTranslation()

  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [openMobileMenu, setOpenMobileMenu] = useState(false)

  const navigation = [
    { key: "menuMobile.createPoll", href: "/create-election" },
    { key: "menuMobile.myPoll", href: "/my-created-poll" },
    { key: "menuMobile.historyVoted", href: "/my-voted-poll" },
    { key: "menuMobile.demo", href: "/demo" }
  ]

  const handleNavClick = (href: string) => {
    setCurrentPath(href)
  }

  return (
    <nav className="fixed z-1000 w-full bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-0">
        <div className="flex items-center">
          <a
            className="mr-10 flex items-center text-2xl font-bold text-blue-900 lg:mr-20 lg:ml-10"
            href="/"
            onClick={() => handleNavClick("/")}
          >
            <img className="mr-3 w-14 lg:w-20" src={voteIcon} alt={t("common.vote")} />
            ElectionPoll
          </a>

          <div className="hidden lg:flex">
            {navigation.map((item) => {
              const isActive = currentPath === item.href

              return (
                <a
                  key={item.href}
                  className={classNames(
                    "mr-10 pb-1 transition-all",
                    "hover:border-b-2 hover:border-blue-900 hover:text-blue-900",
                    isActive
                      ? "border-b-2 border-blue-900 font-normal text-blue-900"
                      : "text-gray-700"
                  )}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                >
                  {t(item.key)}
                </a>
              )
            })}
          </div>
        </div>

        <div className="mr-0 flex items-center gap-3 lg:mr-10">
          {/* Mobile menu button */}
          <button
            className="rounded-sm px-2.5 py-1 hover:bg-gray-100 lg:hidden"
            onClick={() => setOpenMobileMenu(true)}
            aria-label={t("navbar.openMenu")}
          >
            <MenuOutlined style={{ color: "#9b9b9b", fontSize: 15 }} />
          </button>

          <div className="hidden lg:block">
            <ConnectWallet/>
            {/* <UserWalletInfo/> */}
          </div>
        </div>
      </div>

      {openMobileMenu && (
        <MenuMobile open={true} close={() => setOpenMobileMenu(false)} />
      )}
    </nav>
  )
}

export default Navbar