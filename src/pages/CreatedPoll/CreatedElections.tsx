/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, type FC } from "react"
import { Card, Empty, Typography, notification, Spin } from "antd"
import { readContract } from "@wagmi/core"
import { useChainId } from "wagmi"
import { CheckCircleOutlined, WalletOutlined } from "@ant-design/icons"

import { config } from "../../config/config"
import { ElectionFactoryABI } from "../../config/ElectionPollABI"
import ElectionList from "../../components/ElectionList"

import { ELECTION_CONTRACTS } from "../../config/addressContract"
import { useTranslation } from "react-i18next"
import { useGlobalLoading } from "../../contexts/LoadingContext"
import PageHero from "../../components/PageHeader"
import useAppWallet from "../../hooks/useAppWallet"
import { ElectionCompanyFactoryABI } from "../../config/ElectionCompanyABIs"

const { Text, Title } = Typography

const CreatedElectionsPage: FC = () => {
  const { t } = useTranslation()

  const { addressWallet, isConnected } = useAppWallet()
  const [addresses, setAddresses] = useState<`0x${string}`[]>([])

  const { loading } = useGlobalLoading()

  const chainId = useChainId()
  const factoryAddress1 = ELECTION_CONTRACTS[chainId].address
  const factoryAddress2 = ELECTION_CONTRACTS[chainId].addressCompany

  useEffect(() => {
    const loadCreated = async () => {
      if (!addressWallet || !isConnected) {
        setAddresses([])
        return
      }

      try {

        const data1 = await readContract(config, {
          abi: ElectionFactoryABI,
          address: factoryAddress1,
          functionName: "getCreatedElectionsByUser",
          args: [addressWallet]
        })

        const data2 = await readContract(config, {
          abi: ElectionCompanyFactoryABI,
          address: factoryAddress2,
          functionName: "getCreatedElectionsByUser",
          args: [addressWallet]
        })

        const data = [
          ...(data1 as `0x${string}`[]),
          ...(data2 as `0x${string}`[])
        ]

        setAddresses(data as `0x${string}`[])
      } catch (error) {
        console.error(error)
        notification.error({
          message: t("createdElections.notificationLoadFailed"),
          placement: "bottomRight"
        })
      }
    }

    loadCreated()
  }, [addressWallet, isConnected, factoryAddress1,factoryAddress2, t])

  // ===== NOT CONNECTED =====
  if (!isConnected || !addressWallet) {
    return (
      <div className="min-h-screen px-4 py-8 md:px-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <PageHero
            badge={t("createdElections.badge")}
            title={t("createdElections.walletNotConnected")}
            subtitle={t("createdElections.walletNotConnectedSubtitle")}
            highlights={[
              {
                label: t("createdElections.highlightSecure"),
                color: "sky"
              },
              {
                label: t("createdElections.highlightOwnership"),
                color: "emerald"
              },
              {
                label: t("createdElections.highlightTransparent"),
                color: "violet"
              }
            ]}
          />

          <Card className="rounded-3xl border-0 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <WalletOutlined className="text-2xl text-slate-600" />
              </div>

              <Title level={2} className="mb-2! text-slate-800!">
                {t("createdElections.walletNotConnected")}
              </Title>

              <Text className="max-w-xl text-slate-500">
                {t("createdElections.walletNotConnectedSubtitle")}
              </Text>

              <div
                className="
                  mt-8 w-full max-w-sm rounded-2xl
                  border border-dashed border-slate-200
                  bg-slate-50 px-4 py-8
                "
              >
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Text className="text-slate-400">
                      {t("common.noData")}
                    </Text>
                  }
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // ===== CONNECTED =====
  return (
    <div className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHero
          badge={t("createdElections.badge")}
          title={t("createdElections.title")}
          subtitle={t("createdElections.subtitle")}
          highlights={[
            {
              label: t("createdElections.highlightOwned"),
              color: "sky"
            },
            {
              label: t("createdElections.highlightManagement"),
              color: "emerald"
            },
            {
              label: t("createdElections.highlightOnChain"),
              color: "violet"
            }
          ]}
          extra={
            <div className="absolute right-0 top-0 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <CheckCircleOutlined className="text-lg text-sky-300" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-300">
                  {t("createdElections.totalElections")}
                </p>
                <p className="text-2xl font-bold text-white">
                  {addresses.length}
                </p>
              </div>
            </div>
          }
        />

        <Card className="overflow-hidden rounded-3xl border-0 shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
          {loading ? (
            <div className="flex min-h-80 items-center justify-center">
              <Spin size="large" tip={t("electionList.loadingData")} />
            </div>
          ) : (
            <div className="p-4 md:p-6">
              <ElectionList
                addresses={addresses}
                loading={loading}
                emptyText={t("createdElections.emptyText")}
                errorText={t("createdElections.errorText")}
                detailPath={(electionAddress) =>
                  `/election/${electionAddress}`
                }
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default CreatedElectionsPage