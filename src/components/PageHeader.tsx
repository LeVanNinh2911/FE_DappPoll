import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined
} from "@ant-design/icons"
import { Tag } from "antd"
import type { FC, ReactNode } from "react"

interface HighlightItem {
  label: string
  color?: "emerald" | "sky" | "violet" | "blue"
}

interface PageHeroProps {
  badge?: string
  title: string
  subtitle?: string
  highlights?: HighlightItem[]
  tipTitle?: string
  tipDescription?: string
  actionText?: string
  onActionClick?: () => void
  actionIcon?: ReactNode
  extra?: ReactNode
  className?: string
}

const tagColorMap = {
  emerald: "bg-emerald-400/10 text-emerald-200 border border-emerald-300/10",
  sky: "bg-sky-400/10 text-sky-200 border border-sky-300/10",
  violet: "bg-violet-400/10 text-violet-200 border border-violet-300/10",
  blue: "bg-blue-400/10 text-blue-200 border border-blue-300/10"
}

const PageHero: FC<PageHeroProps> = ({
  badge,
  title,
  subtitle,
  highlights = [],
  tipTitle,
  tipDescription,
  actionText,
  extra,
  className = ""
}) => {
  const hasHighlights = highlights.length > 0
  const hasTipCard = Boolean(tipTitle || tipDescription || actionText)
  //const isActionEnabled = Boolean(actionText && onActionClick)
  const getTagClasses = (color: HighlightItem["color"] = "sky") => tagColorMap[color]
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-slate-200/70 bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-7 text-white shadow-[0_18px_50px_rgba(15,23,42,0.10)] md:px-8 md:py-9 ${className}`}
    >
      {/* Soft premium glow */}
      <div className="absolute top-0 right-0 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Soft top line */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-sky-300/50 to-transparent" />

      {/* subtle inner glass */}
      <div className="absolute inset-px rounded-[27px] bg-white/1.5" />

      <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        {/* Left content */}
        <div className="max-w-3xl">
          {badge && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium tracking-wide text-blue-100 backdrop-blur-sm">
              <ThunderboltOutlined className="text-sky-300" aria-hidden="true" />
              <span>{badge}</span>
            </div>
          )}

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-[44px] lg:leading-[1.1]">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200/80 md:text-base">
              {subtitle}
            </p>
          )}

          {hasHighlights && (
            <div className="mt-5 flex flex-wrap gap-3">
              {highlights.map((item, index) => (
                <Tag
                  key={`${item.label}-${index}`}
                  className={`m-0 rounded-full px-3 py-1 text-sm font-medium ${getTagClasses(item.color)}`}
                  icon={<CheckCircleOutlined />}
                >
                  {item.label}
                </Tag>
              ))}
            </div>
          )}

          {extra && <div className="mt-5">{extra}</div>}
        </div>

        {/* Right panel */}
        {hasTipCard && (
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/4.5 p-5 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-sky-400/10 text-sky-300">
                <InfoCircleOutlined aria-hidden="true" />
              </div>

              <div className="min-w-0">
                {tipTitle && (
                  <p className="text-sm font-semibold tracking-wide text-white">
                    {tipTitle}
                  </p>
                )}
                {tipDescription && (
                  <p className="mt-1.5 text-sm leading-6 text-slate-200/75">
                    {tipDescription}
                  </p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  )
}

export default PageHero