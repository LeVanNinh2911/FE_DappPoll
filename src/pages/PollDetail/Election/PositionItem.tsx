/* eslint-disable @typescript-eslint/no-explicit-any */
import { AreaChartOutlined, ArrowRightOutlined, EllipsisOutlined, UserSwitchOutlined} from "@ant-design/icons";
import {Button, Card, Dropdown, Spin, Badge, type MenuProps} from "antd";
import { useState, type FC } from "react";
import { useParams } from "react-router-dom";

import { useWriteTxWithConfirm } from "../../../hooks/useWriteTxWithConfirm";

import VoteSuccessModal from "./components/VoteSuccessModal";
import CandidateOption from "./components/CandidateOption";
import { usePositionData } from "./hooks/usePositionData";
import ConfirmVoteModal from "./components/ConfirmVoteModal";
import AccessRequestsModal from "./components/AccessRequestsModal";
import RequestAccessCard from "./components/RequestAccessCard";

import { useAccessRequestRealtime } from "./hooks/useAccessRequestRealtime";
import { usePositionAccess } from "./hooks/usePositionAccess";
import { usePositionSelection } from "./hooks/usePositionSelection";
import { useVoteAction } from "./hooks/useVoteAction";
import useAppWallet from "../../../hooks/useAppWallet";

interface Props {
  position: any;
  isEnded: any;
  isNotStarted: any;
  reloadElection: () => void;
  election: any;
  setResultPosition: (position: any) => void;
  setDelegatePosition: (id: number) => void;
  isCreator: boolean;
  isPrivate: boolean;
}

const PositionItem: FC<Props> = ({
  position,
  isEnded,
  isNotStarted,
  reloadElection,
  setResultPosition,
  setDelegatePosition,
  isCreator,
  isPrivate
}) => {
  const { addressWallet, walletType, privyWallet } = useAppWallet();
  const { writeTx } = useWriteTxWithConfirm();
  const { address } = useParams();

  const { candidatesData, loadingCandidates, t } =
    usePositionData(position);

  const isMultiple = Number(position.voteType) === 1;
  const minSelect = Number(position.minSelect || 1);
  const maxSelect = Number(position.maxSelect || 1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [txHash, setTxHash] = useState<string>("")

  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // ===== ACCESS HOOK =====
  const { positionCanVote } = usePositionAccess({
    electionAddress: address as `0x${string}`,
    positionId: position.id,
    addressWallet,
    isPrivate
  });

  // ===== REQUEST COUNT REALTIME =====
  const { requestCount } = useAccessRequestRealtime({
    electionAddress: address as `0x${string}`,
    positionId: position.id,
    enabled: isCreator
  });

  // ===== SELECTION HOOK =====
  const {
    selected,
    handleSelectCandidate,
    resetSelection
  } = usePositionSelection({
    isMultiple,
    minSelect,
    maxSelect,
    t,
    isBlocked: isPrivate && !positionCanVote && !isCreator
  });

  const selectedList = selected[position.id] || [];

  // ===== VOTE HOOK =====
  const { handleVote } = useVoteAction({
    address: address as `0x${string}`,
    positionId: position.id,
    selected: selectedList,
    addressWallet,
    walletType,
    privyWallet,
    writeTx,
    reloadElection,
    t,
    minSelect,
    maxSelect,
    onSuccess: (hash?: string) => {
      setConfirmOpen(false);

      if (hash) {
        setTxHash(hash);
      }

      setSuccessOpen(true);

      resetSelection(position.id);
    }
  });

  // ===== MENU =====
  const menuItems: MenuProps["items"] = [
    {
      key: "request",
      label: (
        <div className="flex items-center justify-between w-full">
          <span className="mr-1.5!">Yêu cầu tham gia</span>
          <Badge count={requestCount} size="small" showZero={false} />
        </div>
      ),
      onClick: () => setRequestModalOpen(true)
    }
  ];

  return (
    <Card
      style={{ marginTop: 12, borderRadius: 20 }}
      title={
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-blue-900 mr-3">
              {position.name}
            </span>
            <span className="text-sm text-gray-400">
              {isMultiple
                ? t("positionItem.choose_between", {
                    min: minSelect,
                    max: maxSelect
                  })
                : t("positionItem.choose_one")}
            </span>
          </div>

          {(isCreator && isPrivate) && (
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <Badge count={requestCount} size="small" className="absolute! right-5 top-3" showZero={false}>
                <Button
                  type="text"
                  className="text-lg! rounded-3xl!"
                  icon={<EllipsisOutlined />}
                />
              </Badge>
            </Dropdown>
          )}
        </div>
      }
    >
      {/* MODAL */}
      <AccessRequestsModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        electionAddress={address as `0x${string}`}
        positionId={position.id}
        isCreator={isCreator}
        reload={reloadElection}
      />

      {!positionCanVote && !isCreator && (
        <RequestAccessCard
          electionAddress={address as `0x${string}`}
          positionId={position.id}
          isPrivate={isPrivate}
        />
      )}

      {/* CONTENT */}
      <div
        style={{
          opacity: positionCanVote || isCreator ? 1 : 0.4,
          pointerEvents:
            positionCanVote || isCreator ? "auto" : "none"
        }}
      >
        {loadingCandidates ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : (
          candidatesData.map((candidate, idx) => (
            <CandidateOption
              key={idx}
              candidate={candidate}
              candidateIndex={idx}
              isSelected={selectedList.includes(idx)}
              isMultiple={isMultiple}
              onSelect={(index) =>
                handleSelectCandidate(position.id, index)
              }
              t={t}
            />
          ))
        )}

        {/* ACTIONS */}
        <div className="mt-6 md:flex grid gap-3 ">
          <Button
            type="primary"
            size="large"
            disabled={
              isEnded ||
              isNotStarted ||
              (!positionCanVote && !isCreator)
            }
            onClick={() => {
              setConfirmOpen(true);
            }}
          >
            {t("positionItem.vote")} <ArrowRightOutlined />
          </Button>

          <Button
            size="large"
            className="text-blue-900!"
            onClick={() => setResultPosition(position)}
          >
            <AreaChartOutlined /> {t("positionItem.show_results")}
          </Button>

          <Button
            size="large"
            className="text-blue-900!"
            disabled={!positionCanVote && !isCreator}
            onClick={() => setDelegatePosition(position.id)}
          >
            <UserSwitchOutlined /> {t("positionItem.delegate")}
          </Button>
        </div>
      </div>

      {/* MODALS */}
      <ConfirmVoteModal
        open={confirmOpen}
        onConfirm={handleVote}
        onCancel={() => setConfirmOpen(false)}
        selectedCandidates={(
          selected[position.id] || []
        ).map((i) => candidatesData[i])}
        title={position.name}
      />

      <VoteSuccessModal
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          setTxHash("");
        }}
        position={position}
        txHash={txHash}
        chainExplorer="https://l1testnetscan.trustkeys.network/"
      />
    </Card>
  );
};

export default PositionItem;