{/* eslint-disable @typescript-eslint/no-explicit-any */}

import { useState } from "react";
import { notification } from "antd";

interface Props {
  isMultiple: boolean;
  minSelect: number;
  maxSelect: number;
  t: (key: string, params?: any) => string;
  isBlocked: boolean;
}

export const usePositionSelection = ({
  isMultiple,
  maxSelect,
  t,
  isBlocked
}: Props) => {
  const [selected, setSelected] = useState<Record<number, number[]>>({});

  const handleSelectCandidate = (
    positionId: number,
    candidateIndex: number
  ) => {
    if (isBlocked) return;

    setSelected((prev) => {
      const current = prev[positionId] || [];

      if (!isMultiple) {
        return {
          ...prev,
          [positionId]: [candidateIndex]
        };
      }

      if (current.includes(candidateIndex)) {
        return {
          ...prev,
          [positionId]: current.filter((id) => id !== candidateIndex)
        };
      }

      if (current.length >= maxSelect) {
        notification.warning({
          message: t("positionItem.max_selection_reached", {
            max: maxSelect
          }),
          placement: "bottomRight"
        });
        return prev;
      }

      return {
        ...prev,
        [positionId]: [...current, candidateIndex]
      };
    });
  };

  const resetSelection = (positionId: number) => {
    setSelected((prev) => ({
      ...prev,
      [positionId]: []
    }));
  };

  return {
    selected,
    handleSelectCandidate,
    resetSelection
  };
};