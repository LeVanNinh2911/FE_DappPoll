import { useTranslation } from "react-i18next";

function classNames(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

export const ButtonChangeLanguage = () => {

  const changeLanguage = (lang: "vi" | "en") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  }

  const {i18n} = useTranslation()

  return(
    <div className="border rounded overflow-hidden hidden md:flex">
      <button
        onClick={() => changeLanguage("vi")}
        className={classNames(
          "px-2 py-1 text-sm",
          i18n.language === "vi"
            ? "bg-blue-900 text-white"
            : "bg-white text-gray-600"
        )}
      >
        VI
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={classNames(
          "px-2 py-1 text-sm",
          i18n.language === "en"
            ? "bg-blue-900 text-white"
            : "bg-white text-gray-600"
        )}
      >
        EN
      </button>
    </div>
  )
}