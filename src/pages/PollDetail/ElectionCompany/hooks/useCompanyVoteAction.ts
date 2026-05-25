/* eslint-disable @typescript-eslint/no-explicit-any */

import { notification } from "antd";
import { readVoter } from "../../../../components/readContract";
import { privyWriteContract } from "../../../../hooks/privyWriteContract";
import { ElectionCompanyABI } from "../../../../config/ElectionCompanyABIs";
import { trustkeys } from "../../../../config/config";

interface Props {
  address?: `0x${string}`;
  positionId: number;
  allocations: {
    candidateId: number;
    votes: number;
  }[];
  totalVotingPower: number;
  addressWallet?: `0x${string}`;
  walletType: string | null;
  privyWallet?: any;
  writeTx: any;
  reloadElection: () => Promise<void>;
  t: (key: string, params?: any) => string;
  onSuccess: () => void;
}

export const useCompanyVoteAction = ({
  address,
  positionId,
  allocations,
  totalVotingPower,
  addressWallet,
  walletType,
  privyWallet,
  writeTx,
  reloadElection,
  t,
  onSuccess
}: Props) => {

  const handleVote = async () => {
    try {

      if (!address || !addressWallet) {
        return;
      }

      if (allocations.length === 0) {
        return notification.warning({
          message: t("companyVote.no_allocations"),
          placement: "bottomRight"
        });
      }

      const totalUsed =
        allocations.reduce(
          (sum, a) => sum + Number(a.votes || 0),
          0
        );

      if (totalUsed > totalVotingPower) {
        return notification.warning({
          message: t("companyVote.exceed_voting_power"),
          placement: "bottomRight"
        });
      }

      const voter = await readVoter(
        address,
        positionId,
        addressWallet
      );

      if (voter?.voted) {
        return notification.warning({
          message: t("positionItem.already_voted"),
          placement: "bottomRight"
        });
      }

      const args = [
        positionId,
        allocations.map((a) => ({
          candidateId: BigInt(a.candidateId),
          votes: BigInt(a.votes)
        }))
      ];

      if (walletType === "privy") {
        if (!privyWallet) {
          throw new Error(
            "Privy wallet not found"
          );
        }
        await privyWriteContract({
          wallet: privyWallet,
          address,
          abi: ElectionCompanyABI,
          functionName: "vote",
          args,
          chain: trustkeys
        });

      } else {
        await writeTx({
          address,
          abi: ElectionCompanyABI,
          functionName: "vote",
          args,
          successMessage:
            t("companyVote.vote_success")
        });

      }
      onSuccess();
      await reloadElection();
    } catch (err: any) {
      notification.error({
        message: t("positionItem.transaction_failed"),
        description:
          err?.shortMessage ||
          err?.message ||
          "Transaction failed",
        placement: "bottomRight"
      });
      console.error(err);
    }
  };
  return {
    handleVote
  };
};