import { useEffect, useState, useCallback } from "react";
import { publicClient } from "../../../../config/config";
import { ElectionAccessControlABI } from "../../../../config/ElectionPollABI";
import { ACCESS_CONTROL_ADDRESS } from "../../../../config/addressContract";

interface Props {
  electionAddress?: `0x${string}`;
  positionId: number;
  addressWallet?: `0x${string}`;
  isPrivate: boolean;
  enabled?: boolean; // optional (default true)
}

export const usePositionAccess = ({
  electionAddress,
  positionId,
  addressWallet,
  isPrivate,
  enabled = true
}: Props) => {

  const [requested, setRequested] = useState(false);
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===== FETCH STATE =====
  const fetchState = useCallback(async () => {
    if (!addressWallet || !electionAddress || !enabled) return;

    try {
      if (!isPrivate) {
        setRequested(true);
        setApproved(true);
        setLoading(false);
        return;
      }

      const [req, appr] = await publicClient.readContract({
        address: ACCESS_CONTROL_ADDRESS,
        abi: ElectionAccessControlABI,
        functionName: "getVoterStatus",
        args: [
          electionAddress,
          BigInt(positionId),
          addressWallet
        ]
      }) as [boolean, boolean];

      setRequested(req);
      setApproved(appr);
    } catch (err) {
      console.error("usePositionAccess error:", err);
      setRequested(false);
      setApproved(false);
    } finally {
      setLoading(false);
    }
  }, [addressWallet, electionAddress, positionId, isPrivate, enabled]);

  // ===== INITIAL LOAD =====
  useEffect(() => {
    fetchState();
  }, [fetchState]);

  // ===== REALTIME EVENT =====
  useEffect(() => {
    if (!addressWallet || !enabled) return;

    const args = {
      election: electionAddress,
      positionId: BigInt(positionId),
      voter: addressWallet
    };

    const unwatchRequested = publicClient.watchContractEvent({
      address: ACCESS_CONTROL_ADDRESS,
      abi: ElectionAccessControlABI,
      eventName: "AccessRequested",
      args,
      onLogs: fetchState
    });

    const unwatchApproved = publicClient.watchContractEvent({
      address: ACCESS_CONTROL_ADDRESS,
      abi: ElectionAccessControlABI,
      eventName: "AccessApproved",
      args,
      onLogs: fetchState
    });

    const unwatchRejected = publicClient.watchContractEvent({
      address: ACCESS_CONTROL_ADDRESS,
      abi: ElectionAccessControlABI,
      eventName: "AccessRejected",
      args,
      onLogs: fetchState
    });

    return () => {
      unwatchRequested();
      unwatchApproved();
      unwatchRejected();
    };
  }, [addressWallet, electionAddress, positionId, fetchState, enabled]);

  // ===== POLLING FALLBACK =====
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(fetchState, 6000);
    return () => clearInterval(interval);
  }, [fetchState, enabled]);

  // ===== FINAL STATE =====
  const positionCanVote = !isPrivate || approved;

  return {
    requested,
    approved,
    positionCanVote,
    loading,
    refetch: fetchState
  };
};