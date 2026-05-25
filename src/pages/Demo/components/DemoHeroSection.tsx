import { type FC } from "react"
import { Button, Space, Tag, Typography } from "antd"
import {
  PlayCircleOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const { Title, Paragraph } = Typography

const DemoHeroSection: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-8 md:px-6 md:pt-12">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-950 via-blue-950 to-slate-950 shadow-xl">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.15),transparent_30%)]" />
        <div className="absolute bottom-0 left-10 h-44 w-44 rounded-full bg-blue-300/10 blur-3xl" />
        <div className="absolute -top-10 right-0 h-52 w-52 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative z-10 px-6 py-10 md:px-10 md:py-14">
          <div className="max-w-3xl">

            {/* Top chips */}
            <Space wrap size={[8, 8]} className="mt-4 mb-5">
              {["badge1", "badge2", "badge3"].map((key) => (
                <Tag
                  key={key}
                  className="m-0 rounded-full border border-white/10 bg-white/8 px-3 py-0.5 text-[11px] font-medium text-blue-100"
                >
                  {t(`demoPage.hero.${key}`)}
                </Tag>
              ))}
            </Space>

            {/* Title */}
            <Title className="mb-4! text-3xl! font-extrabold! leading-tight! text-white! md:text-5xl!">
              {t("demoPage.hero.title")}
            </Title>

            {/* Subtitle */}
            <Paragraph className="max-w-2xl text-base! leading-8! text-blue-100/85! md:text-lg!">
              {t("demoPage.hero.subtitle")}
            </Paragraph>

            {/* Actions */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                type="primary"
                className="h-11! rounded-xl! border-none! bg-white! px-8! text-sm! font-bold! text-blue-900! shadow-md! hover:bg-blue-50!"
                onClick={() => navigate("/create-election")}
              >
                {t("demoPage.hero.createBtn")}
              </Button>

              <Button
                className="h-11! rounded-xl! border border-white/20! bg-blue-700/70! px-8! text-sm! font-bold! text-white! backdrop-blur-sm! hover:bg-blue-600!"
                icon={<PlayCircleOutlined />}
                onClick={() => {
                  const section = document.getElementById("live-demo-section")
                  section?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                {t("demoPage.hero.tryBtn")}
              </Button>
            </div>

            {/* Bottom trust line */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {["feature1", "feature2", "feature3"].map((feat) => (
                <div
                  key={feat}
                  className="flex items-center gap-2 text-sm font-medium text-blue-100/80"
                >
                  <SafetyCertificateOutlined className="text-sky-300" />
                  <span>{t(`demoPage.hero.${feat}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DemoHeroSection