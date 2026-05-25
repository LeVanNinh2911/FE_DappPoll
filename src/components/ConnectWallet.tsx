/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Dropdown, Space, message } from "antd"
import {
  DisconnectOutlined,
  GoogleOutlined,
  LogoutOutlined,
  WalletOutlined,
  CopyOutlined
} from "@ant-design/icons"
import { injected, useConnect, useConnection, useDisconnect } from "wagmi"
import type { FC } from "react"
import { useTranslation } from "react-i18next"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { useEffect, useRef } from "react"
import { airdropToken } from "../services/backend"

const shortAddress = (addr: `0x${string}` | string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`

const shortAddressV2 = (addr: `0x${string}` | string) =>
  `${addr.slice(0, 12)}...${addr.slice(-10)}`

export const AddressWithCopy = ({
  address
}: {
  address: `0x${string}` | string
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    message.success("Copied address!")
  }

  return (
    <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
      <span>ID: {shortAddressV2(address)}</span>
      <CopyOutlined
        onClick={handleCopy}
        className="cursor-pointer hover:text-blue-500"
      />
    </div>
  )
}

const ConnectWallet: FC = () => {
  const { t } = useTranslation()

  // Wagmi / MetaMask
  const connection = useConnection()
  const { mutate: connect, isPending } = useConnect()
  const { mutate: disconnect } = useDisconnect()

  // Privy / Google login
  const { login, logout, authenticated, user, ready } = usePrivy()
  const { wallets } = useWallets()

  const privyWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  )

  const isPrivyConnected = authenticated && !!privyWallet?.address
  const isInjectedConnected = connection.status === "connected"

  const hasAirdropped = useRef(false)

  useEffect(() => {
    const runAirdrop = async () => {
      try {
        if (hasAirdropped.current) return

        const walletAddress =
          privyWallet?.address || connection.address

        if (!walletAddress) return

        hasAirdropped.current = true

        await airdropToken(user?.id || null, walletAddress)
      } catch (err) {
        console.error(err)
      }
    }

    if (ready) {
      runAirdrop()
    }
  }, [privyWallet?.address, connection.address, ready, user?.id])

  // ===== 1) PRIVY =====
  if (ready && isPrivyConnected) {
    const items = [
      {
        key: "email",
        label: (
          <div className="text-xs text-gray-500">
            {user?.google?.email ||
              user?.email?.address ||
              "Privy User"}
          </div>
        ),
        disabled: true
      },
      {
        key: "address",
        label: <AddressWithCopy address={privyWallet.address} />,
        disabled: true
      },
      {
        key: "disconnect",
        icon: <LogoutOutlined />,
        label: t("Disconnect Google Wallet"),
        onClick: () => logout()
      }
    ]

    return (
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Button type="primary" className="bg-blue-900! hover:bg-blue-800!">
          <Space>
            <GoogleOutlined />
            {shortAddress(privyWallet.address)}
          </Space>
        </Button>
      </Dropdown>
    )
  }

  // ===== 2) METAMASK =====
  if (isInjectedConnected) {
    const items = [
      {
        key: "address",
        label: <AddressWithCopy address={connection.address} />,
        disabled: true
      },
      {
        key: "disconnect",
        icon: <DisconnectOutlined />,
        label: `${t("Disconnect")}`,
        onClick: () => disconnect()
      }
    ]

    return (
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Button type="primary" className="bg-blue-900! hover:bg-blue-800!">
          <Space>
            <WalletOutlined />
            {shortAddress(connection.address)}
          </Space>
        </Button>
      </Dropdown>
    )
  }

  // ===== 3) CHƯA CONNECT =====
  const connectItems = [
    {
      key: "google",
      icon: <GoogleOutlined />,
      label: t("Continue with Google"),
      onClick: () => login()
    },
    {
      key: "metamask",
      icon: <WalletOutlined />,
      label: t("Connect MetaMask"),
      onClick: () => connect({ connector: injected() })
    }
  ]

  return (
    <Dropdown menu={{ items: connectItems }} trigger={["click"]}>
      <Button
        type="primary"
        icon={<WalletOutlined />}
        loading={isPending}
        block
        className="bg-blue-900! hover:bg-blue-800!"
      >
        {t("Login")}
      </Button>
    </Dropdown>
  )
}

export default ConnectWallet