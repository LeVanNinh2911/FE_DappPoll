import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "../i18n/en.json"
import vi from "../i18n/vi.json"

const savedLang =
  localStorage.getItem("lang") ||
  navigator.language.split("-")[0] ||
  "vi"

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi }
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
})

export default i18n