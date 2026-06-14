import type { PlayerStats } from '../types'

interface StatsBarProps {
  stats: PlayerStats
  playerName: string
  stage: string
  progress: { current: number; total: number }
}

export function StatsBar({ stats, playerName, stage, progress }: StatsBarProps) {
  return (
    <div className="bg-slate-900/80 border-b border-slate-700/50 sticky top-0 z-10 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium text-sm">{playerName}</span>
            <span className="bg-slate-800 text-slate-400 text-xs px-2.5 py-1 rounded-full">
              {stage}
            </span>
          </div>
          <span className="text-slate-500 text-xs">
            {progress.current}/{progress.total}
          </span>
        </div>

        {/* Stats bars */}
        <div className="grid grid-cols-5 gap-2">
          <StatItem
            label="声誉"
            value={stats.reputation}
            color="bg-blue-500"
            dangerZone={20}
          />
          <StatItem
            label="安全"
            value={stats.safety}
            color="bg-emerald-500"
            dangerZone={15}
          />
          <StatItem
            label="心理"
            value={stats.mental}
            color="bg-amber-500"
            dangerZone={20}
          />
          <StatItem
            label="支持"
            value={stats.support}
            color="bg-purple-500"
            dangerZone={20}
          />
          <StatItem
            label="法律"
            value={100 - stats.legalRisk}
            color="bg-red-500"
            dangerZone={80}
            invert
            invertLabel="风险"
          />
        </div>
      </div>
    </div>
  )
}

function StatItem({
  label,
  value,
  color,
  dangerZone,
  invert,
  invertLabel,
}: {
  label: string
  value: number
  color: string
  dangerZone: number
  invert?: boolean
  invertLabel?: string
}) {
  const displayValue = invert ? 100 - value : value
  const isDanger = invert ? value > dangerZone : value < dangerZone

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1">
        <span className={`text-xs font-bold ${isDanger ? 'text-red-400' : 'text-slate-400'}`}>
          {displayValue}
        </span>
        <span className={`text-[10px] ${isDanger ? 'text-red-500' : 'text-slate-600'}`}>
          {invert ? invertLabel : label}
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isDanger ? 'bg-red-500' : color
          }`}
          style={{ width: `${Math.max(0, displayValue)}%` }}
        />
      </div>
    </div>
  )
}
