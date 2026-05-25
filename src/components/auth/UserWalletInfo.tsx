import { Card, Typography } from "antd"
import { useWallets } from "@privy-io/react-auth"

const { Text } = Typography

const UserWalletInfo = () => {
  const { wallets } = useWallets()

  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  )

  return (
    <Card title="Thông tin ví">
      <p>
        <Text strong>Địa chỉ ví:</Text>{" "}
        {embeddedWallet?.address || "Chưa có ví"}
      </p>
    </Card>
  )
}

export default UserWalletInfo