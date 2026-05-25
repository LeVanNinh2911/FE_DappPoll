import { useMemo, useState, type FC } from "react"
import {
  Button,
  Card,
  Col,
  Divider,
  Progress,
  Radio,
  Row,
  Space,
  Tag,
  Typography,
  message
} from "antd"
import {
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  TeamOutlined
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const { Title, Paragraph, Text } = Typography

type Candidate = {
  id: number
  name: string
  faculty: string
  votes: number
}

const ElectionDemoSection: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<number | null>(null)
  const [voted, setVoted] = useState(false)

  const candidates = useMemo<Candidate[]>(
    () => [
      { id: 1, name: "Le Van Ninh", faculty: t("home.demo.candidate1Role"), votes: 48 },
      { id: 2, name: "Tran Minh Khoa", faculty: t("home.demo.candidate2Role"), votes: 31 },
      { id: 3, name: "Nguyen Bao Chau", faculty: t("home.demo.candidate3Role"), votes: 21 }
    ],
    [t]
  )

  const totalVotes = candidates.reduce((sum, item) => sum + item.votes, 0)

  const handleVote = () => {
    if (selected === null) {
      message.warning(t("home.demo.selectWarning"))
      return
    }

    setVoted(true)
    message.success(t("home.demo.voteSuccess"))
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="mb-10 text-center">
        <Tag
          color="blue"
          className="rounded-full px-4 py-1 text-sm font-medium"
        >
          {t("home.demo.badge")}
        </Tag>

        <Title className="mb-3! mt-4! text-3xl! md:text-4xl! text-slate-900!">
          {t("home.demo.title")}
        </Title>

        <Paragraph className="mx-auto mb-0! max-w-3xl text-slate-600 md:text-lg!">
          {t("home.demo.subtitle")}
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} align="stretch">
        {/* LEFT: DEMO */}
        <Col xs={24} lg={14}>
          <Card
            className="h-full overflow-hidden rounded-3xl! border-0 shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
            style={{ padding: 0 }}
          >
            <div className="rounded-2xl bg-linear-to-r from-blue-900 via-slate-900 to-indigo-900 px-6 py-6 text-white md:px-8">
              <Space vertical size={6} className="w-full">
                <Space wrap>
                  <Tag color="gold" className="rounded-full px-3 py-1 font-medium">
                    {t("home.demo.liveBadge")}
                  </Tag>
                  <Tag color="blue" className="rounded-full px-3 py-1 font-medium">
                    {t("home.demo.secureBadge")}
                  </Tag>
                </Space>

                <Title level={3} className="mb-0! text-white!">
                  {t("home.demo.pollTitle")}
                </Title>

                <Text className="text-white/90!">
                  {t("home.demo.pollDesc")}
                </Text>
              </Space>
            </div>

            <div className="px-6 py-6 md:px-8 md:py-8">
              {!voted ? (
                <>
                  <Paragraph className="mb-5! text-base! text-slate-600!">
                    {t("home.demo.makeChoice")}
                  </Paragraph>

                  <Radio.Group
                    className="w-full"
                    onChange={(e) => setSelected(e.target.value)}
                    value={selected}
                  >
                    <Space vertical size={16} className="w-full">
                      {candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className={`rounded-2xl border p-4 transition-all ${
                            selected === candidate.id
                              ? "border-blue-700 bg-blue-50 shadow-sm"
                              : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                          }`}
                        >
                          <Radio value={candidate.id} className="w-full">
                            <div className="ml-2 flex flex-col">
                              <Text strong className="text-base text-blue-900!">
                                {candidate.name}
                              </Text>
                              <Text type="secondary">{candidate.faculty}</Text>
                            </div>
                          </Radio>
                        </div>
                      ))}
                    </Space>
                  </Radio.Group>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleVote}
                      className="rounded-xl border-blue-900! bg-blue-900! px-6! shadow-md hover:bg-blue-800!"
                    >
                      {t("home.demo.voteNow")}
                    </Button>

                    <Button
                      size="large"
                      className="rounded-xl border-slate-300 text-slate-700!"
                      onClick={() => setVoted(true)}
                      icon={<BarChartOutlined />}
                    >
                      {t("home.demo.showResults")}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <Title level={4} className="mb-1! text-blue-900!">
                        {t("home.demo.resultTitle")}
                      </Title>
                      <Text type="secondary">
                        {t("home.demo.resultDesc")}
                      </Text>
                    </div>

                    <Tag color="blue" className="rounded-full px-3 py-1">
                      {totalVotes} {t("home.demo.votes")}
                    </Tag>
                  </div>

                  <Space vertical size={20} className="w-full">
                    {candidates.map((candidate) => {
                      const percent = Math.round((candidate.votes / totalVotes) * 100)

                      return (
                        <div
                          key={candidate.id}
                          className="rounded-2xl border border-slate-200 bg-white p-4"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <Text strong className="block text-base text-blue-900!">
                                {candidate.name}
                              </Text>
                              <Text type="secondary">{candidate.faculty}</Text>
                            </div>
                            <Tag color="blue" className="rounded-full px-3 py-1">
                              {candidate.votes} {t("home.demo.votes")}
                            </Tag>
                          </div>

                          <Progress
                            percent={percent}
                            strokeColor="#1e3a8a"
                            railColor="#dbeafe"
                            showInfo
                          />
                        </div>
                      )
                    })}
                  </Space>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      size="large"
                      className="rounded-xl border-slate-300 text-slate-700!"
                      onClick={() => {
                        setVoted(false)
                        setSelected(null)
                      }}
                    >
                      {t("home.demo.backToVote")}
                    </Button>

                  </div>
                </>
              )}
            </div>
          </Card>
        </Col>

        {/* RIGHT: FEATURES */}
        <Col xs={24} lg={10}>
          <Card className="h-full rounded-3xl! border-0 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
            <Space vertical size={18} className="w-full">
              <div>
                <Tag color="blue" className="rounded-full px-3 py-1">
                  {t("home.demo.whyBadge")}
                </Tag>
                <Title level={3} className="mb-2! mt-4! text-blue-900!">
                  {t("home.demo.whyTitle")}
                </Title>
                <Paragraph className="mb-0! text-slate-600!">
                  {t("home.demo.whyDesc")}
                </Paragraph>
              </div>

              <Divider className="my-1!" />

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <Space align="start">
                  <div className="rounded-2xl bg-blue-100 p-3 text-blue-800!">
                    <ClockCircleOutlined className="text-xl" />
                  </div>
                  <div>
                    <Text strong className="block text-base text-blue-900!">
                      {t("home.demo.feature1Title")}
                    </Text>
                    <Text type="secondary">{t("home.demo.feature1Desc")}</Text>
                  </div>
                </Space>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <Space align="start">
                  <div className="rounded-2xl bg-sky-100 p-3 text-sky-800">
                    <BarChartOutlined className="text-xl" />
                  </div>
                  <div>
                    <Text strong className="block text-base text-blue-900!">
                      {t("home.demo.feature2Title")}
                    </Text>
                    <Text type="secondary">{t("home.demo.feature2Desc")}</Text>
                  </div>
                </Space>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <Space align="start">
                  <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                    <SafetyCertificateOutlined className="text-xl" />
                  </div>
                  <div>
                    <Text strong className="block text-base text-blue-900!">
                      {t("home.demo.feature3Title")}
                    </Text>
                    <Text type="secondary">{t("home.demo.feature3Desc")}</Text>
                  </div>
                </Space>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <Space align="start">
                  <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                    <TeamOutlined className="text-xl" />
                  </div>
                  <div>
                    <Text strong className="block text-base text-blue-900!">
                      {t("home.demo.feature4Title")}
                    </Text>
                    <Text type="secondary">{t("home.demo.feature4Desc")}</Text>
                  </div>
                </Space>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <Space align="start">
                  <CheckCircleOutlined className="mt-1 text-lg text-blue-800!" />
                  <div>
                    <Text strong className="block text-base text-blue-900!">
                      {t("home.demo.noteTitle")}
                    </Text>
                    <Text type="secondary">{t("home.demo.noteDesc")}</Text>
                  </div>
                </Space>
              </div>

              <Button
                type="primary"
                size="large"
                className="rounded-xl border-blue-900! bg-blue-900! px-6! shadow-md hover:bg-blue-800!"
                onClick={() => navigate("/create-election")}
              >
                {t("home.demo.createElection")}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </section>
  )
}

export default ElectionDemoSection