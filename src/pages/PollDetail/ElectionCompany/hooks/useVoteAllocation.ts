/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import { notification } from "antd";

interface Props {
  positionId: number;
  totalVotingPower: number;
  t: (key: string, params?: any) => string;
  isBlocked: boolean;
}

export interface VoteAllocationState {
  [candidateId: number]: number;
}

export const useVoteAllocation = ({
  positionId,
  totalVotingPower,
  isBlocked
}: Props) => {

  const [allocations, setAllocations] =
    useState<Record<number, VoteAllocationState>>({});

  const currentAllocations =
    allocations[positionId] || {};

  const usedVotes = useMemo(() => {
    return Object.values(currentAllocations)
      .reduce((sum, votes) => sum + Number(votes || 0), 0);
  }, [currentAllocations]);

  const remainingVotes = totalVotingPower - usedVotes;

  const setVote = (candidateId: number, votes: number) => {

    if (isBlocked) return;

    if (Number.isNaN(votes)) return;

    if (votes < 0) {
      return notification.warning({
        message: "Số phiếu không hợp lệ",
        description: "Số phiếu không được nhỏ hơn 0",
        placement: "bottomRight"
      });
    }

    if (!Number.isInteger(votes)) {
      return notification.warning({
        message: "Dữ liệu không hợp lệ",
        description: "Chỉ được nhập số nguyên cho số phiếu",
        placement: "bottomRight"
      });
    }

    const cloned = { ...currentAllocations };
    cloned[candidateId] = votes;

    const totalAfterUpdate =
      Object.values(cloned).reduce(
        (sum, v) => sum + Number(v || 0),
        0
      );

    if (totalAfterUpdate > totalVotingPower) {
      return notification.warning({
        message: "Vượt quá quyền biểu quyết",
        description: `Tối đa bạn chỉ có ${totalVotingPower} phiếu`,
        placement: "bottomRight"
      });
    }

    // xoá nếu = 0
    if (votes === 0) {
      delete cloned[candidateId];
    }

    setAllocations((prev) => ({
      ...prev,
      [positionId]: cloned
    }));
  };

  // =========================
  // RESET
  // =========================
  const resetAllocations = () => {
    setAllocations((prev) => ({
      ...prev,
      [positionId]: {}
    }));
  };

  // =========================
  // ARRAY FORMAT
  // =========================
  const allocationArray = useMemo(() => {
    return Object.entries(currentAllocations)
      .map(([candidateId, votes]) => ({
        candidateId: Number(candidateId),
        votes: Number(votes)
      }))
      .filter((a) => a.votes > 0);
  }, [currentAllocations]);

  // =========================
  // VALIDATION
  // =========================
  const isValidAllocation =
    allocationArray.length > 0 &&
    usedVotes <= totalVotingPower;

  return {
    allocations: currentAllocations,
    allocationArray,

    // stats
    usedVotes,
    remainingVotes,
    totalVotingPower,

    // validation
    isValidAllocation,

    // actions
    setVote,
    resetAllocations
  };
};