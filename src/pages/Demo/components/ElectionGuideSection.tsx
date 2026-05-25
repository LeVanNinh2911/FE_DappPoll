import { type FC } from "react"
import { Button, Card, Col, Row, Space, Typography } from "antd"
import {
  FormOutlined,
  FundProjectionScreenOutlined,
  PieChartOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const { Title, Paragraph, Text } = Typography

const ElectionGuideSection: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const steps = [
    {
      icon: <FormOutlined className="text-xl" />,
      title: t("home.guide.step1Title"),
      desc: t("home.guide.step1Desc")
    },
    {
      icon: <FundProjectionScreenOutlined className="text-xl" />,
      title: t("home.guide.step2Title"),
      desc: t("home.guide.step2Desc")
    },
    {
      icon: <PieChartOutlined className="text-xl" />,
      title: t("home.guide.step3Title"),
      desc: t("home.guide.step3Desc")
    }
  ]

  const tips = [
    {
      title: t("home.guide.tip1Title"),
      desc: t("home.guide.tip1Desc")
    },
    {
      title: t("home.guide.tip2Title"),
      desc: t("home.guide.tip2Desc")
    },
    {
      title: t("home.guide.tip3Title"),
      desc: t("home.guide.tip3Desc")
    }
  ]

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 md:px-6 md:pb-20">
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
        {/* Header */}
        <div className="border-b border-slate-200 bg-linear-to-r from-slate-950 via-blue-950 to-slate-950 px-6 py-10 md:px-8 md:py-12">
          <div className="mx-auto max-w-3xl text-center">

            <Title level={2} className="mb-3! mt-4! text-2xl! font-bold! text-white! md:text-4xl!">
              {t("home.guide.title")}
            </Title>

            <Paragraph className="mx-auto mb-0! max-w-2xl text-sm! leading-7! text-white/75! md:text-base!">
              {t("home.guide.subtitle")}
            </Paragraph>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-8 md:px-8 md:py-10">
          {/* Steps */}
          <Row gutter={[16, 16]}>
            {steps.map((step, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="h-full rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <Space vertical size={14} className="w-full">
                    <div className="flex items-start justify-between">
                      <div className="rounded-2xl bg-blue-50 p-3 text-blue-800 ring-1 ring-blue-100">
                        {step.icon}
                      </div>
                      <span className="text-sm font-semibold tracking-wide text-slate-300">
                        STEP 0{index + 1}
                      </span>
                    </div>

                    <div>
                      <Title level={4} className="mb-2! text-lg! font-semibold! text-blue-900!">
                        {step.title}
                      </Title>
                      <Paragraph className="mb-0! text-sm! leading-7! text-slate-600!">
                        {step.desc}
                      </Paragraph>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Bottom content */}
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
            {/* Left */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 md:p-6">
              <Title level={3} className="mb-2! text-xl! font-semibold! text-blue-900!">
                {t("home.guide.leftTitle")}
              </Title>

              <Paragraph className="mb-5! text-sm! leading-7! text-slate-600!">
                {t("home.guide.leftDesc")}
              </Paragraph>

              <div className="space-y-3">
                {tips.map((tip, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-all hover:border-blue-200 hover:shadow-sm"
                  >
                    <Text strong className="block text-sm text-blue-900!">
                      {tip.title}
                    </Text>
                    <Text className="text-sm text-slate-500!">
                      {tip.desc}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Right CTA */}
            <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-slate-50 p-5 md:p-6">
              <Title level={3} className="mb-2! font-semibold! text-blue-900!">
                {t("home.guide.ctaTitle")}
              </Title>

              <Paragraph className="mb-5! text-sm! leading-7! text-slate-600!">
                {t("home.guide.ctaDesc")}
              </Paragraph>

              <Space vertical size={12} className="w-full">
                <Button
                  type="primary"
                  size="large"
                  block
                  className="h-11 rounded-xl border-0 bg-blue-900! font-medium shadow-sm hover:bg-blue-800!"
                  onClick={() => navigate("/create-election")}
                >
                  {t("home.guide.createBtn")}
                </Button>

                {/* <Button
                  size="large"
                  block
                  icon={<RightOutlined />}
                  className="h-11 rounded-xl border-slate-300 bg-white font-medium text-slate-700 hover:!border-blue-300 hover:!text-blue-800"
                  onClick={() => navigate("/elections")}
                >
                  {t("home.guide.exploreBtn")}
                </Button> */}
                
              </Space>

              <div className="mt-5 rounded-xl border border-slate-200 bg-white/80 px-4 py-3">
                <Text className="text-xs leading-6 text-slate-500">
                  {t("home.guide.tip1Desc")}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ElectionGuideSection