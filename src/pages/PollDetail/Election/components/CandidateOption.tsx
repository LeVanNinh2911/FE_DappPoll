{/* eslint-disable @typescript-eslint/no-explicit-any */}
import { Checkbox, Radio, Image } from "antd";
import { getIPFSUrl } from "../../../../config/ipfs";

interface CandidateOptionProps {
  candidate: any;
  candidateIndex: number;
  isSelected: boolean;
  isMultiple: boolean;
  onSelect: (index: number) => void;
  t: any;
}

const CandidateOption: React.FC<CandidateOptionProps> = ({
  candidate,
  candidateIndex,
  isSelected,
  isMultiple,
  onSelect,
  t,
}) => {
  return (
    <div
      onClick={() => onSelect(candidateIndex)}
      className="relative mb-5 flex cursor-pointer flex-col gap-4 rounded-2xl p-4 transition-all duration-200 md:flex-row md:gap-8 md:p-5"
      style={{
        border: isSelected ? "2px solid #1e3a8a" : "1px solid #d1d5db",
        background: isSelected ? "#eff6ff" : "#fff",
        boxShadow: isSelected
          ? "0 10px 24px rgba(30, 58, 138, 0.10)"
          : "0 2px 10px rgba(15, 23, 42, 0.03)",
      }}
    >
      {isMultiple ? (
        <Checkbox
          checked={isSelected}
          className="absolute right-3.75 top-3.75"
          onClick={(e) => e.stopPropagation()}
          onChange={() => onSelect(candidateIndex)}
        />
      ) : (
        <Radio
          checked={isSelected}
          className="absolute right-3.75 top-3.75"
          onClick={(e) => e.stopPropagation()}
          onChange={() => onSelect(candidateIndex)}
        />
      )}

      {candidate.image && (
        <Image
          src={getIPFSUrl(candidate.image)}
          className="rounded-xl object-cover md:h-28 md:w-28"
          width={140}
          height={150}
          preview={false}
          style={{
            borderRadius: 16,
            objectFit: "cover",
            border: isSelected ? "2px solid #bfdbfe" : "1px solid #e5e7eb",
          }}
        />
      )}

      <div className="flex-1">
        <p className="text-lg font-semibold text-slate-800 md:text-xl">
          {candidate.name}
        </p>
        <div className="mt-2 text-sm leading-7 text-slate-500 md:mt-3">
          {candidate.description || t("no_description")}
        </div>
      </div>
    </div>
  );
};

export default CandidateOption;