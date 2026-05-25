{/* eslint-disable @typescript-eslint/no-explicit-any */}

import { useState, useEffect } from "react";
import { notification } from "antd";

import { useTranslation } from "react-i18next";
import { getIPFSUrl } from "../../../../config/ipfs";

export const usePositionData = (position: any) => {
  const [candidatesData, setCandidatesData] = useState<any[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoadingCandidates(true);
        const list = await Promise.all(
          position.candidates.map(async (candidate: any) => {
            const cid = candidate.name;
            try {
              const res = await fetch(getIPFSUrl(cid));
              const data = await res.json();
              return {
                name: data.name,
                description: data.description,
                image: data.image,
              };
            } catch {
              return {
                name: t("unknown_candidate"),
                description: t("cannot_load_candidate_data"),
                image: "",
              };
            }
          })
        );
        setCandidatesData(list);
      } catch (err) {
        notification.error({
          title: t("failed_to_load_candidates"),
          description: `${err}`,
          placement: "bottomRight",
        });
      } finally {
        setLoadingCandidates(false);
      }
    };

    if (position?.candidates?.length) fetchCandidates();
  }, [position?.candidates, t]);

  return { candidatesData, loadingCandidates, t };
};