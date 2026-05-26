/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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
  const [expanded, setExpanded] = useState(false);

  const description =
    candidate.description?.trim() || t("no_description");

  const shouldShowExpandButton = description.length > 150;

  return (
    <div
      onClick={() => onSelect(candidateIndex)}
      className={`
        mb-4 cursor-pointer overflow-hidden rounded-2xl border
        transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
        ${
          isSelected
            ? "border-blue-800 bg-blue-50 shadow-md"
            : "border-slate-200 bg-white"
        }
      `}
    >
      <div className="flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:gap-6">
        {/* Image */}
        {candidate.image && (
          <div className="flex justify-center md:justify-start">
            <Image
              src={getIPFSUrl(candidate.image)}
              preview={false}
              className="overflow-hidden rounded-xl"
              style={{
                width: "100%",
                maxWidth: 180,
                height: 180,
                objectFit: "cover",
                border: isSelected
                  ? "2px solid #93c5fd"
                  : "1px solid #e5e7eb",
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="pr-2 text-base font-semibold text-slate-800 sm:text-lg md:text-xl">
              {candidate.name}
            </h3>

            <div onClick={(e) => e.stopPropagation()}>
              {isMultiple ? (
                <Checkbox
                  checked={isSelected}
                  onChange={() => onSelect(candidateIndex)}
                />
              ) : (
                <Radio
                  checked={isSelected}
                  onChange={() => onSelect(candidateIndex)}
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-3">
            <p
              className={`
                text-sm leading-6 text-slate-600 sm:text-base
                ${
                  expanded
                    ? ""
                    : "line-clamp-3 md:line-clamp-none"
                }
              `}
            >
              {description}
            </p>

            {shouldShowExpandButton && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((prev) => !prev);
                }}
                className="mt-2 text-sm font-medium text-blue-600 transition hover:text-blue-800 md:hidden"
              >
                {expanded ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateOption;