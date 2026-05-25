/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge, Tag } from "antd";
import {
  CalendarOutlined,
  ClockCircleTwoTone,
  WalletOutlined,
} from "@ant-design/icons";
import { useMemo, type FC } from "react";
import { useTranslation } from "react-i18next";

interface ElectionHeroProps {
  election: any;
  positionsCount: number;
  walletAddress?: boolean;
  currentTime: number; // Đảm bảo currentTime và startTime/endTime cùng đơn vị (giây)
}

const ElectionDetailsHeader: FC<ElectionHeroProps> = ({
  election,
  positionsCount,
  walletAddress,
  currentTime,
}) => {
  const { t } = useTranslation();

  const isEnded = election ? currentTime > election.endTime : false;
  const isNotStarted = election ? currentTime < election.startTime : false;

  const status = useMemo(() => {
    if (isEnded) {
      return { label: t("ended"), color: "red", badgeStatus: "error" as const };
    }
    if (isNotStarted) {
      return {
        label: t("electionDetails.upcoming"),
        color: "orange",
        badgeStatus: "warning" as const,
      };
    }
    return {
      label: t("electionDetails.ongoing"),
      color: "blue",
      badgeStatus: "processing" as const,
    };
  }, [isEnded, isNotStarted, t]);

  const timeParts = useMemo(() => {
    if (!election) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    let target = election.endTime - currentTime;
    if (isNotStarted) target = election.startTime - currentTime;

    if (target <= 0) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    const days = Math.floor(target / 86400);
    const hours = Math.floor((target % 86400) / 3600);
    const minutes = Math.floor((target % 3600) / 60);
    const seconds = target % 60;

    return {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  }, [election, currentTime, isNotStarted]);

  const countdownTitle = isEnded
    ? t("electionDetails.ended")
    : isNotStarted
    ? t("electionDetails.startsIn")
    : t("electionDetails.timeRemaining");

  const countdownHint = isEnded
    ? t("electionDetails.votingClosed")
    : isNotStarted
    ? t("electionDetails.untilVotingStarts")
    : t("electionDetails.untilVotingEnds");


  // Nếu bạn cần thu nhỏ cả ô đếm ngược, hãy cập nhật lại hàm renderTimeBox này:
  const renderTimeBox = (value: string, label: string) => (
    <div className="group flex flex-col items-center justify-center rounded-xl bg-white/5 border border-white/10 py-3 px-2 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-blue-400/30">
      <div className="font-mono text-xl md:text-2xl font-bold text-white tracking-wide">
        {value}
      </div>
      <div className="mt-1 text-[9px] md:text-[10px] font-medium text-slate-400 uppercase tracking-widest group-hover:text-slate-300">
        {label}
      </div>
    </div>
  );

  return (
    <div 
      className="relative w-full rounded-t-2xl overflow-hidden 
        bg-linear-to-br from-slate-950 via-blue-950 to-slate-900
        p-5 md:p-7 border border-slate-800 shadow-xl"
    >
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/20 blur-[90px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-60 h-60 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* --- Phần Header: Title & Description --- */}
        <div className="flex flex-col gap-3 max-w-4xl">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="m-0 rounded-full bg-blue-500/10 text-blue-300 border-blue-500/20 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
              Election
            </Tag>

            <Tag
              color={status.color}
              className="m-0 rounded-full px-2.5 py-0.5 text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm"
            >
              <Badge status={status.badgeStatus} className="scale-100! mr-1!" />
              <span>{status.label}</span>
            </Tag>

            <Tag className="m-0 rounded-full bg-white/5 text-slate-300 border-white/10 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
              {positionsCount} {t("electionDetails.positions")}
            </Tag>
          </div>

          {/* Title & Desc */}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400 tracking-tight m-0">
              {election?.title || "Untitled Election"}
            </h1>
            <p className="mt-2 text-slate-400 text-sm md:text-base leading-relaxed max-w-3xl">
              {election?.description || t("electionDetails.noDescription")}
            </p>
          </div>
        </div>

        {/* --- Phần Info & Countdown --- */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
          {/* Box: Timeline Info */}
          <div className="flex flex-col justify-center rounded-2xl p-5 bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-full bg-blue-500/10 text-blue-400">
                  <CalendarOutlined className="text-sm" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-0.5">
                    {t("createElection.startTime")}
                  </div>
                  <div className="text-slate-100 font-semibold text-base">
                    {election?.startTime
                      ? new Date(election.startTime * 1000).toLocaleString()
                      : "—"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-full bg-indigo-500/10 text-indigo-400">
                  <ClockCircleTwoTone twoToneColor="#818cf8" className="text-sm" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-0.5">
                    {t("createElection.endTime")}
                  </div>
                  <div className="text-slate-100 font-semibold text-base">
                    {election?.endTime
                      ? new Date(election.endTime * 1000).toLocaleString()
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Box: Countdown */}
          <div className="rounded-2xl p-5 border border-blue-500/20 bg-linear-to-br from-blue-900/20 to-slate-900/50 backdrop-blur-xl shadow-lg shadow-blue-900/10">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-base mb-4">
              <ClockCircleTwoTone twoToneColor="#60a5fa" />
              {countdownTitle}
            </div>

            {isEnded ? (
              <div className="flex flex-col items-center justify-center py-6 bg-black/20 rounded-xl border border-white/5">
                <div className="text-2xl font-bold text-slate-300">
                  {t("electionDetails.ended")}
                </div>
                <div className="mt-1.5 text-sm text-slate-500 font-medium">
                  {countdownHint}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-4 gap-2 md:gap-3">
                  {renderTimeBox(timeParts.days, t("electionDetails.days"))}
                  {renderTimeBox(timeParts.hours, t("electionDetails.hours"))}
                  {renderTimeBox(timeParts.minutes, t("electionDetails.minutes"))}
                  {renderTimeBox(timeParts.seconds, t("electionDetails.seconds"))}
                </div>
                <div className="text-slate-400 text-xs font-medium text-center">
                  {countdownHint}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- Phần Cảnh báo Wallet --- */}
        {!walletAddress && (
          <div className="flex gap-3 items-center rounded-xl px-4 py-3 bg-amber-500/10 border border-amber-500/20 backdrop-blur-md">
            <div className="p-1.5 bg-amber-500/20 rounded-full text-amber-400">
              <WalletOutlined className="text-lg" />
            </div>
            <div>
              <div className="text-amber-400 font-semibold text-sm">
                {t("electionDetails.connectWallet")}
              </div>
              <div className="text-amber-200/70 text-xs mt-0.5">
                {t("electionDetails.walletHint")}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ElectionDetailsHeader;