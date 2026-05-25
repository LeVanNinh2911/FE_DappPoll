{/* eslint-disable @typescript-eslint/no-explicit-any */ }

import { notification } from "antd";
import { readVoter } from "../../../../components/readContract";
import { ElectionABI } from "../../../../config/ElectionPollABI";
import { privyWriteContract } from "../../../../hooks/privyWriteContract";
import { trustkeys } from "../../../../config/config";

interface Props {
  address?: `0x${string}`;
  positionId: number;
  selected: number[];
  addressWallet?: `0x${string}`;
  walletType: string | null;
  privyWallet?: any;
  writeTx: any;
  reloadElection: () => void;
  t: (key: string, params?: any) => string;
  minSelect: number;
  maxSelect: number;
  onSuccess?: (txHash?: string) => void;
}

export const useVoteAction = ({
  address,
  positionId,
  selected,
  addressWallet,
  walletType,
  privyWallet,
  writeTx,
  reloadElection,
  t,
  minSelect,
  maxSelect,
  onSuccess
}: Props) => {
  const handleVote = async () => {
    try {
      if (!address || !addressWallet) return;

      if (
        selected.length < minSelect ||
        selected.length > maxSelect
      ) {
        return notification.warning({
          message: t("positionItem.invalid_selection_range", {
            min: minSelect,
            max: maxSelect
          }),
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

      const args: [number, number[]] = [
        positionId,
        selected.map(Number)
      ];

      let txHash = "";

      if (walletType === "privy") {
        if (!privyWallet) throw new Error("Privy wallet not found");

        const result: any = await privyWriteContract({
          wallet: privyWallet,
          address,
          abi: ElectionABI,
          functionName: "vote",
          args,
          chain: trustkeys
        });
        if (typeof result === "string") {
          txHash = result;
        } else if (result?.hash) {
          txHash = result.hash;
        }
      } else {
        const result: any = await writeTx({
          address,
          abi: ElectionABI,
          functionName: "vote",
          args,
          successMessage: t("positionItem.vote_submitted_successfully")
        });

        if (typeof result === "string") {
          txHash = result;
        } else if (result?.hash) {
          txHash = result.hash;
        }
      }

      onSuccess?.(txHash);
      await reloadElection();

    } catch (err: any) {
      notification.error({
        message: t("positionItem.transaction_failed"),
        description: err?.message,
        placement: "bottomRight"
      });
    }
  };

  return { handleVote };
};