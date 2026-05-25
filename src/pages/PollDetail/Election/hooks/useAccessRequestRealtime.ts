/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { watchContractEvent } from "@wagmi/core";
import { publicClient, config } from "../../../../config/config";
import { ElectionAccessControlABI } from "../../../../config/ElectionPollABI";
import { ACCESS_CONTROL_ADDRESS } from "../../../../config/addressContract";

interface Props {
  electionAddress?: `0x${string}`;
  positionId?: number;
  enabled?: boolean; // thường là isCreator
}

export const useAccessRequestRealtime = ({
  electionAddress,
  positionId,
  enabled = true
}: Props) => {
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ===== SYNC FROM CONTRACT =====
  const syncCount = useCallback(async () => {
    if (!electionAddress || positionId === undefined || !enabled) return;

    try {
      setLoading(true);

      const count = await publicClient.readContract({
        address: ACCESS_CONTROL_ADDRESS,
        abi: ElectionAccessControlABI,
        functionName: "getPendingRequestsCount",
        args: [
          electionAddress,
          BigInt(positionId)
        ]
      });

      setRequestCount(Number(count));
    } catch (err) {
      console.error("syncCount error:", err);
    } finally {
      setLoading(false);
    }
  }, [electionAddress, positionId, enabled]);

  // ===== INITIAL LOAD =====
  useEffect(() => {
    syncCount();
  }, [syncCount]);

  // ===== REALTIME =====
  useEffect(() => {
    if (!electionAddress || positionId === undefined || !enabled) return;

    const baseConfig = {
      config,
      address: ACCESS_CONTROL_ADDRESS,
      abi: ElectionAccessControlABI,
      args: {
        election: electionAddress,
        positionId: BigInt(positionId)
      }
    };

    const unwatchRequest = watchContractEvent(config,{
      ...baseConfig,
      eventName: "AccessRequested",
      onLogs: syncCount
    });

    const unwatchApprove = watchContractEvent(config,{
      ...baseConfig,
      eventName: "AccessApproved",
      onLogs: syncCount
    });

    const unwatchReject = watchContractEvent(config,{
      ...baseConfig,
      eventName: "AccessRejected",
      onLogs: syncCount
    });

    return () => {
      unwatchRequest();
      unwatchApprove();
      unwatchReject();
    };
  }, [electionAddress, positionId, enabled, syncCount]);

  return {
    requestCount,
    loading,
    refresh: syncCount
  };
};