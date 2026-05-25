{/* eslint-disable @typescript-eslint/no-explicit-any */}

import {
  CalendarOutlined,
  CheckCircleOutlined,
  PlusOutlined
} from "@ant-design/icons"
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  Select,
  Typography,
  message
} from "antd"
import FormItem from "antd/es/form/FormItem"
import { useRef, useState, type FC } from "react"
import { useNavigate } from "react-router-dom"

import { useGlobalLoading } from "../../contexts/LoadingContext"
import Settings from "./Setting"
import ElectionPoll from "./Election/ElectionPoll"
import type { ElectionPollRef } from "./Election/ElectionPoll"
import { useTranslation } from "react-i18next"
import PageHero from "../../components/PageHeader"
import useAppWallet from "../../hooks/useAppWallet"

const CreateElection: FC = () => {
  const { t } = useTranslation()
  const { addressWallet, isConnected } = useAppWallet()
  const navigate = useNavigate()

  const [form] = Form.useForm()
  const [description, setDescription] = useState(false)

  const pollType = Form.useWatch("pollType", form)
  const privacy = Form.useWatch("privacy", form)
  const [typeResult, setTypeResult] = useState(1)

  const electionRef = useRef<ElectionPollRef>(null)
  const { loading, show, hide } = useGlobalLoading()

  const pollTypes = [
    {
      value: 0,
      label: (
        <p className="text-gray-500">
          <CheckCircleOutlined className="mr-1" />{" "}
          {t("createElection.pollTypes.election")}
        </p>
      )
    },
    {
      value: 1,
      label: (
        <p className="text-gray-500">
          <CalendarOutlined className="mr-1" />{" "}
          {t("createElection.pollTypes.meeting")}
        </p>
      )
    },
  ]

  const itemsPrivacy = [
    {
      value: false,
      label: <p className="text-gray-500">{t("createElection.sessionVote")}</p>
    },
    {
      value: true,
      label: <p className="text-gray-500">{t("createElection.walletVote")}</p>
    }
  ]

  return (
    <div className="min-h-screen px-2 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
      <PageHero
        badge={t("createElection.heroBadge")}
        title={t("createElection.pageTitle")}
        subtitle={t("createElection.pageSubtitle")}
        highlights={[
          {
            label: t("createElection.highlightSecure"),
            color: "emerald"
          },
          {
            label: t("createElection.highlightTransparent"),
            color: "sky"
          },
          {
            label: t("createElection.highlightFastSetup"),
            color: "violet"
          }
        ]}
        tipTitle={t("createElection.tipTitle")}
        tipDescription={t("createElection.tipDescription")}
        actionText={t("createElection.quickStart")}
        actionIcon={<PlusOutlined />}
        onActionClick={() => {
          const formElement = document.getElementById("create-election-form")
          formElement?.scrollIntoView({ behavior: "smooth", block: "start" })
        }}
      />

        <Card
          style={{
            margin: "0 auto",
            borderColor: "#e7e7e7"
          }}
          className="max-w-5xl shadow-lg"
        >
          <div className="mb-4">
            <h2 className="text-lg font-bold text-blue-900">
              {t("createElection.basicInformation")}
            </h2>
            <p className="text-gray-400">
              {t("createElection.startDetails")}
            </p>
          </div>

          {!isConnected && (
            <div>
              <Typography.Text type="warning">
                ⚠️ {t("createElection.connectWalletWarning")}
              </Typography.Text>
              <Divider />
            </div>
          )}

          <Form
            form={form}
            layout="vertical"
            disabled={loading}
            initialValues={{
              pollType: 0,
              privacy: false,
              description: ""
            }}
            onFinish={async (values) => {
              try {
                show("wallet")

                const payload = {
                  ...values,
                  resultVisibility: typeResult
                }

                const result: any =
                  await electionRef.current?.createElection(payload)

                if (result?.address) {
                  setTimeout(() => {
                    hide()
                    navigate(`/poll/${result.address}`)
                  }, 800)
                  return
                }

                hide()
              } catch (error) {
                console.error(error)
                message.error(t("createElection.createFailed"))
                hide()
              }
            }}
          >
            <Form.Item
              label={<b>{t("createElection.title")}</b>}
              name="title"
              style={{ marginBottom: 12 }}
              rules={[
                { required: true, message: t("createElection.validation.titleRequired") }
              ]}
            >
              <Input
                placeholder={t("createElection.placeholders.title")}
                className="h-12 shadow-xs"
                style={{ borderRadius: 10 }}
              />
            </Form.Item>

            {!description && (
              <button
                type="button"
                className="mb-4 text-gray-500 hover:text-gray-600"
                onClick={() => setDescription(true)}
              >
                <PlusOutlined /> {t("createElection.addDescription")}
              </button>
            )}

            {description && (
              <Form.Item
                label={
                  <b>
                    {t("createElection.description")}{" "}
                    <span className="text-gray-500">
                      ({t("common.optional")})
                    </span>
                  </b>
                }
                name="description"
              >
                <Input.TextArea
                  rows={3}
                  className="shadow-xs"
                  style={{ borderRadius: 10 }}
                />

                <button
                  type="button"
                  className="float-right mt-2 text-gray-500 hover:text-gray-600"
                  onClick={() => setDescription(false)}
                >
                  {t("createElection.hideDescription")}
                </button>
              </Form.Item>
            )}

            <div className="gap-6 md:flex">
              <Form.Item
                label={<b>{t("createElection.pollType")}</b>}
                name="pollType"
                className="md:w-4/9"
              >
                <Select
                  className="h-12 shadow-xs"
                  options={pollTypes}
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>

              <FormItem
                label={<b>{t("createElection.votingSecurity")}</b>}
                name="privacy"
                className="my-5 md:w-3/9"
              >
                <Select
                  className="h-12 shadow-xs"
                  options={itemsPrivacy}
                  style={{ borderRadius: 10 }}
                />
              </FormItem>
            </div>

            <Form.Item
              label={<b>{t("createElection.votingTime")}</b>}
              name="time"
              rules={[
                {
                  required: true,
                  message: t("createElection.validation.timeRequired")
                }
              ]}
            >
              <DatePicker.RangePicker
                showTime
                className="h-12 w-full shadow-xs md:w-6/10"
                style={{ borderRadius: 10 }}
                placeholder={[
                  t("createElection.startTime"),
                  t("createElection.endTime")
                ]}
              />
            </Form.Item>

            {/* {pollType === 1 && (
              <>
                <Divider />
                <ElectionPoll ref={electionRef} privacy={privacy} />
              </>
            )} */}

            <Divider />

            <ElectionPoll ref={electionRef} privacy={privacy} pollType={pollType}/>

            <Divider />

            <Settings typeResult={typeResult} onChange={setTypeResult} />

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              disabled={!addressWallet || loading}
              className="bg-blue-900! hover:bg-blue-800! h-10!"

            >
              {t("createElection.create")}
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default CreateElection