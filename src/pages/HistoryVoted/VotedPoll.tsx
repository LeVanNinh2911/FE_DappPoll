/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, type FC } from "react"
import { Card, Empty, Typography, notification, Spin } from "antd"
import { readContract } from "@wagmi/core"
import { useChainId } from "wagmi"

import { config } from "../../config/config"
import ElectionList from "../../components/ElectionList"
import { ElectionFactoryABI } from "../../config/ElectionPollABI"
import { ELECTION_CONTRACTS } from "../../config/addressContract"
import { CheckCircleOutlined, WalletOutlined } from "@ant-design/icons"
import Title from "antd/es/typography/Title"
import { useTranslation } from "react-i18next"
import { useGlobalLoading } from "../../contexts/LoadingContext"
import PageHero from "../../components/PageHeader"
import useAppWallet from "../../hooks/useAppWallet"
import { ElectionCompanyFactoryABI } from "../../config/ElectionCompanyABIs"

const { Text } = Typography

const VotedElectionsPage: FC = () => {
  const { t } = useTranslation()
  const { addressWallet, isConnected } = useAppWallet()
  const [addresses, setAddresses] = useState<`0x${string}`[]>([])
  const { loading } = useGlobalLoading()

  const chainId = useChainId()
  const factoryAddress1 = ELECTION_CONTRACTS[chainId].address
  const factoryAddress2 = ELECTION_CONTRACTS[chainId].addressCompany


  useEffect(() => {
    const loadParticipated = async () => {
      if (!addressWallet || !isConnected) {
        setAddresses([])
        return
      }

      if (!factoryAddress1 || !factoryAddress2) {
        notification.error({
          message: t("contract_not_found"),
          description: t("factory_contract_not_found_desc"),
          placement: "bottomRight"
        })
        setAddresses([])
        return
      }

      try {

        const data1 = await readContract(config, {
          abi: ElectionFactoryABI,
          address: factoryAddress1,
          functionName: "getParticipatedElectionsByUser",
          args: [addressWallet]
        })

        const data2 = await readContract(config, {
          abi: ElectionCompanyFactoryABI,
          address: factoryAddress2,
          functionName: "getParticipatedElectionsByUser",
          args: [addressWallet]
        })

        const data = [
          ...(data1 as `0x${string}`[]),
          ...(data2 as `0x${string}`[])
        ]

        setAddresses(data as `0x${string}`[])
      } catch (error: any) {
        console.error(error)
        notification.error({
          message: t("failed_to_load_voting_history"),
          description:
            error?.shortMessage ||
            error?.message ||
            t("please_try_again_later"),
          placement: "bottomRight"
        })
      }
    }

    loadParticipated()
  }, [addressWallet, isConnected, factoryAddress1,factoryAddress2, t])

  if (!isConnected || !addressWallet) {
    return (
      <div className="min-h-screen px-4 py-8 md:px-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <PageHero
            badge={t("votedElections.badge", "Voting History")}
            title={t("wallet_not_connected_yet")}
            subtitle={t(
              "votedElections.walletNotConnectedSubtitle",
              "Connect your wallet to review the elections you have participated in and track your voting activity."
            )}
            highlights={[
              {
                label: t("votedElections.highlightHistory", "Voting History"),
                color: "sky"
              },
              {
                label: t("votedElections.highlightTracking", "Track Participation"),
                color: "emerald"
              },
              {
                label: t("votedElections.highlightTransparent", "Transparent Records"),
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
                {t("wallet_not_connected_yet")}
              </Title>

              <Text className="max-w-xl text-slate-500">
                {t(
                  "votedElections.walletNotConnectedSubtitle",
                  "Connect your wallet to review the elections you have participated in and track your voting activity."
                )}
              </Text>

              <div className="mt-8 w-full max-w-sm rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Text className="text-slate-400">
                      {t("no_data_to_display")}
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

  return (
    <div className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHero
          badge={t("votedElections.badge", "Voting History")}
          title={t("voted_elections_title")}
          subtitle={t("voted_elections_subtitle")}
          highlights={[
            {
              label: t("votedElections.highlightParticipated", "Participated Elections"),
              color: "sky"
            },
            {
              label: t("votedElections.highlightPersonalActivity", "Personal Activity"),
              color: "emerald"
            },
            {
              label: t("votedElections.highlightOnChain", "On-chain Verification"),
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
                  {t("total_elections")}
                </p>
                <p className="text-2xl font-bold text-white">{addresses.length}</p>
              </div>
            </div>
          }
        />

        <Card className="overflow-hidden rounded-3xl border-0 shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
          {loading ? (
            <div className="flex min-h-80 flex-col items-center justify-center gap-4">
              <Spin size="large" />
              <Text className="animate-pulse text-slate-400">
                {t("loading_data")}
              </Text>
            </div>
          ) : (
            <div className="p-4 md:p-6">
              <ElectionList
                addresses={addresses}
                loading={loading}
                emptyText={t("you_havent_voted_any_elections_yet")}
                errorText={t("error_loading_historical_data")}
                detailPath={(electionAddress) => `/election/${electionAddress}`}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default VotedElectionsPage