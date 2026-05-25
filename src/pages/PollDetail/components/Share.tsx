import { useState, type FC } from "react"
import { Card, Input, Button, notification, Tooltip } from "antd"
import {
  ShareAltOutlined,
  CopyOutlined,
  MailOutlined,
  WhatsAppOutlined,
  TwitterOutlined,
  FacebookOutlined,
  RedditOutlined,
  QrcodeOutlined,
} from "@ant-design/icons"
import type { Address } from "viem"
import copy from "copy-to-clipboard"
import CreateQRCode from "./CreateQRCode"
import { useTranslation } from "react-i18next"

interface Props {
  address: Address
}

const Share: FC<Props> = ({ address }) => {
  const link = `${window.location.origin}/election/${address}`
  const [openQrModal, setOpenQrModal] = useState(false)
  const { t } = useTranslation()

  const handleCopy = () => {
    copy(link)
    notification.success({
      message: t("share.copiedSuccessfully"),
      placement: "bottomRight"
    })
  }

  // --- Logic Chia sẻ ---
  const shareText = encodeURIComponent(t("share.message", "Check out this election!"))
  const encodedLink = encodeURIComponent(link)

  const shareActions = {
    mail: `mailto:?subject=${shareText}&body=${encodedLink}`,
    whatsapp: `https://wa.me/?text=${shareText}%20${encodedLink}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedLink}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
    reddit: `https://www.reddit.com/submit?url=${encodedLink}&title=${shareText}`,
  }

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <>
      <Card
        style={{
          maxWidth: 1040,
          margin: "28px auto 40px",
          borderRadius: 18,
          border: "1px solid #e2e8f0",
        }}
        className="shadow-lg!"
        styles={{ body: { padding: 28 } }}
      >
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center gap-4 ">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-3xl bg-blue-900!"
              style={{
                color: "white",
                boxShadow: "0 8px 20px rgba(30, 58, 138, 0.18)"
              }}
            >
              <ShareAltOutlined style={{ fontSize: 18 }} />
            </div>

            <div className="text-lg font-semibold text-blue-900">
              {t("share.title")}
            </div>
          </div>

          {/* Link box */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0"
            }}
          >
            <div className="mb-3 text-sm font-medium text-slate-700">
              {t("share.shareLink")}
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <Input
                value={link}
                readOnly
                style={{
                  height: 46,
                  borderRadius: 12
                }}
              />

              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={handleCopy}
                style={{
                  height: 46,
                  minWidth: 132,
                  borderRadius: 12,
                  background: "#1e3a8a",
                  borderColor: "#1e3a8a",
                  fontWeight: 600
                }}
              >
                {t("share.copyLink")}
              </Button>
            </div>
          </div>

          {/* Social actions */}
          <div>
            <div className="mb-3 text-sm font-medium text-slate-700">
              {t("share.shareTo", "Share to")}
            </div>

            <div className="flex gap-4 justify-center">
              <Tooltip title={t("common.mail")}>
                <Button
                  shape="circle"
                  icon={<MailOutlined />}
                  onClick={() => openLink(shareActions.mail)}
                  style={{
                    height: 42,
                    width: 42,
                    borderColor: "#dbeafe",
                    color: "#1e3a8a",
                    background: "#eff6ff"
                  }}
                />
              </Tooltip>

              <Tooltip title={t("common.whatsApp")}>
                <Button
                  shape="circle"
                  icon={<WhatsAppOutlined />}
                  onClick={() => openLink(shareActions.whatsapp)}
                  style={{
                    height: 42,
                    width: 42,
                    borderColor: "#dbeafe",
                    color: "#1e3a8a",
                    background: "#eff6ff"
                  }}
                />
              </Tooltip>

              <Tooltip title={t("common.twitter")}>
                <Button
                  shape="circle"
                  icon={<TwitterOutlined />}
                  onClick={() => openLink(shareActions.twitter)}
                  style={{
                    height: 42,
                    width: 42,
                    borderColor: "#dbeafe",
                    color: "#1e3a8a",
                    background: "#eff6ff"
                  }}
                />
              </Tooltip>

              <Tooltip title={t("common.facebook")}>
                <Button
                  shape="circle"
                  icon={<FacebookOutlined />}
                  onClick={() => openLink(shareActions.facebook)}
                  style={{
                    height: 42,
                    width: 42,
                    borderColor: "#dbeafe",
                    color: "#1e3a8a",
                    background: "#eff6ff"
                  }}
                />
              </Tooltip>

              <Tooltip title={t("common.reddit")}>
                <Button
                  shape="circle"
                  icon={<RedditOutlined />}
                  onClick={() => openLink(shareActions.reddit)}
                  style={{
                    height: 42,
                    width: 42,
                    borderColor: "#dbeafe",
                    color: "#1e3a8a",
                    background: "#eff6ff"
                  }}
                />
              </Tooltip>

              <Tooltip title={t("common.qrCode")}>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<QrcodeOutlined />}
                  onClick={() => setOpenQrModal(true)}
                  style={{
                    height: 42,
                    width: 42,
                    background: "#1e3a8a",
                    borderColor: "#1e3a8a"
                  }}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>

      <CreateQRCode
        open={openQrModal}
        close={() => setOpenQrModal(false)}
        link={link}
        address={address}
      />
    </>
  )
}

export default Share