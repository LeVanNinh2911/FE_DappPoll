import { DownloadOutlined } from "@ant-design/icons"
import { Button, Modal, notification } from "antd"
import { QRCodeCanvas } from "qrcode.react"
import { useRef, type FC } from "react"
import { useTranslation } from "react-i18next"
import type { Address } from "viem"

interface Props {
  open: boolean
  close: () => void
  link: string
  address: Address
}

const CreateQRCode: FC<Props> = ({ open, close, link, address }) => {
  const qrWrapperRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation()

  const handleDownloadQR = () => {
    const canvas = qrWrapperRef.current?.querySelector("canvas")

    if (!canvas) {
      notification.error({
        message: t("share.qrNotFound"),
        placement: "bottomRight"
      })
      return
    }

    const url = canvas.toDataURL("image/png")
    const a = document.createElement("a")
    a.href = url
    a.download = `election-qr-${address}.png`
    a.click()
  }

  return (
    <Modal
      open={open}
      onCancel={close}
      title={t("Quét mã QR để tham gia cuộc bầu cử")}
      centered
      footer={[
        <Button key="close" onClick={close}>
          {t("common.cancel")}
        </Button>,
        <Button
          key="download"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownloadQR}
        >
          {t("common.download")}
        </Button>
      ]}
    >
      <div className="flex flex-col items-center justify-center gap-4 py-4">
        <div
          ref={qrWrapperRef}
          className="rounded-2xl bg-white p-4 shadow-sm"
        >
          <QRCodeCanvas
            value={link}
            size={220}
          />
        </div>

        <p className="mb-0 break-all text-center text-sm text-gray-500">
          {link}
        </p>
      </div>
    </Modal>
  )
}

export default CreateQRCode