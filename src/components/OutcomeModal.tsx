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
  const hasZeroStat = stats.safety <= 0 || stats.mental <= 0 || stats.reputation <= 0

  return (
    <div className="fixed inset-0 z-20 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full max-h-[85vh] overflow-auto shadow-2xl">
        <div className="p-5 space-y-4">
          {/* Outcome narrative */}
          <div>
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              结果
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">{option.outcome}</p>
          </div>

          {/* Stat changes */}
          <div className="bg-slate-800/30 rounded-xl p-3">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <StatDiff label="声誉" oldVal={oldStats.reputation} newVal={stats.reputation} />
              <StatDiff label="安全" oldVal={oldStats.safety} newVal={stats.safety} />
              <StatDiff label="心理" oldVal={oldStats.mental} newVal={stats.mental} />
              <StatDiff label="支持" oldVal={oldStats.support} newVal={stats.support} />
              <StatDiff label="法律" oldVal={oldStats.legalRisk} newVal={stats.legalRisk} isRisk />
            </div>
          </div>

          {/* Continue button */}
          <button
            onClick={onDismiss}
            className={`w-full py-3 rounded-xl font-bold text-base transition-all active:scale-[0.98] ${
              hasZeroStat
                ? 'bg-red-600 text-white hover:bg-red-500'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {hasZeroStat ? '查看结局' : '继续'}
          </button>
        </div>
      </div>
    </div>
  )
}
