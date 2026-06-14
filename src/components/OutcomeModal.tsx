import type { GameEvent, EventOption, PlayerStats, CareerStage } from '../types'

interface OutcomeModalProps {
  event: GameEvent
  option: EventOption
  stats: PlayerStats
  oldStats: PlayerStats
  stage: CareerStage
  isLastEvent: boolean
  onDismiss: () => void
}

function StatDiff({
  label,
  oldVal,
  newVal,
  isRisk,
}: {
  label: string
  oldVal: number
  newVal: number
  isRisk?: boolean
}) {
  const diff = newVal - oldVal
  if (diff === 0) return null
  const isPositive = isRisk ? diff < 0 : diff > 0
  const sign = diff > 0 ? '+' : ''

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        isPositive ? 'text-emerald-400' : 'text-red-400'
      }`}
    >
      {label} {sign}
      {diff}
    </span>
  )
}

export function OutcomeModal({
  event: _event,
  option,
  stats,
  oldStats,
  stage: _stage,
  isLastEvent,
  onDismiss,
}: OutcomeModalProps) {
  const hasFatal = stats.safety <= 10 || stats.legalRisk >= 90
  const hasZeroStat = stats.safety <= 0 || stats.mental <= 0 || stats.reputation <= 0

  return (
    <div className="fixed inset-0 z-20 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-auto shadow-2xl">
        <div className="p-6 space-y-4">
          {/* Banner */}
          <div
            className={`rounded-xl p-4 text-center ${
              hasFatal
                ? 'bg-red-950/50 border border-red-800/30'
                : option.isRecommended
                  ? 'bg-emerald-950/50 border border-emerald-800/30'
                  : 'bg-amber-950/50 border border-amber-800/30'
            }`}
          >
            <div className="text-3xl mb-2">
              {hasFatal ? '⚠️' : option.isRecommended ? '✅' : '🤔'}
            </div>
            <p
              className={`font-bold text-lg ${
                hasFatal ? 'text-red-400' : option.isRecommended ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {hasFatal ? '严重警告' : option.isRecommended ? '明智之选' : '值得商榷'}
            </p>
          </div>

          {/* Outcome narrative */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              后续发展
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">{option.outcome}</p>
          </div>

          {/* Stat changes */}
          <div className="bg-slate-800/30 rounded-xl p-4">
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              属性变化
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <StatDiff label="声誉" oldVal={oldStats.reputation} newVal={stats.reputation} />
              <StatDiff label="安全" oldVal={oldStats.safety} newVal={stats.safety} />
              <StatDiff label="心理" oldVal={oldStats.mental} newVal={stats.mental} />
              <StatDiff label="支持" oldVal={oldStats.support} newVal={stats.support} />
              <StatDiff
                label="法律风险"
                oldVal={oldStats.legalRisk}
                newVal={stats.legalRisk}
                isRisk
              />
            </div>
            {Object.keys(option.statsEffect).length === 0 && (
              <p className="text-slate-500 text-sm">无明显变化</p>
            )}
          </div>

          {/* Tip */}
          <div className="bg-blue-950/30 border border-blue-800/30 rounded-xl p-4">
            <h3 className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
              生存指南
            </h3>
            <p className="text-blue-200 text-sm leading-relaxed">{option.tip}</p>
          </div>

          {/* Continue button */}
          <button
            onClick={onDismiss}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition-all active:scale-[0.98] ${
              hasZeroStat
                ? 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20'
            }`}
          >
            {hasZeroStat
              ? '查看结局'
              : isLastEvent
                ? '进入下一阶段'
                : '继续'}
          </button>
        </div>
      </div>
    </div>
  )
}
