import type { PlayerStats, GameRecord, CareerStage } from '../types'

interface EndingScreenProps {
  ending: { title: string; description: string; emoji: string }
  stats: PlayerStats
  history: GameRecord[]
  stage: CareerStage
  recommendedCount: number
  totalChoices: number
  onRestart: () => void
}

export function EndingScreen({
  ending,
  stats,
  history,
  stage,
  recommendedCount,
  totalChoices,
  onRestart,
}: EndingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 overflow-auto">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Ending banner */}
        <div className="text-center space-y-4">
          <div className="text-7xl">{ending.emoji}</div>
          <h1 className="text-3xl font-bold text-white">{ending.title}</h1>
          <p className="text-slate-400 whitespace-pre-line leading-relaxed">
            {ending.description}
          </p>
        </div>

        {/* Final stats */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h2 className="text-slate-400 text-sm font-semibold mb-3">最终属性</h2>
          <div className="space-y-2">
            <FinalStatBar
              label="职业声誉"
              value={stats.reputation}
              color="bg-blue-500"
            />
            <FinalStatBar
              label="安全指数"
              value={stats.safety}
              color="bg-emerald-500"
            />
            <FinalStatBar
              label="心理状态"
              value={stats.mental}
              color="bg-amber-500"
            />
            <FinalStatBar
              label="科室支持"
              value={stats.support}
              color="bg-purple-500"
            />
            <FinalStatBar
              label="法律风险"
              value={100 - stats.legalRisk}
              color="bg-red-500"
            />
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
            <p className="text-2xl font-bold text-white">{stage}</p>
            <p className="text-slate-500 text-xs">到达阶段</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
            <p className="text-2xl font-bold text-emerald-400">
              {totalChoices > 0
                ? Math.round((recommendedCount / totalChoices) * 100)
                : 0}
              %
            </p>
            <p className="text-slate-500 text-xs">明智选择率</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
            <p className="text-2xl font-bold text-amber-400">
              {totalChoices}
            </p>
            <p className="text-slate-500 text-xs">事件经历</p>
          </div>
        </div>

        {/* Decision history */}
        <div className="space-y-2">
          <h2 className="text-slate-400 text-sm font-semibold">决策回顾</h2>
          {history.map((record, i) => (
            <div
              key={i}
              className={`border rounded-lg p-3 text-sm ${
                record.wasRecommended
                  ? 'bg-emerald-950/20 border-emerald-800/30'
                  : 'bg-amber-950/20 border-amber-800/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-300 truncate">{record.eventTitle}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    record.wasRecommended
                      ? 'bg-emerald-600/20 text-emerald-400'
                      : 'bg-amber-600/20 text-amber-400'
                  }`}
                >
                  {record.wasRecommended ? '明智' : '欠妥'}
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-1 truncate">
                {record.chosenLabel}
              </p>
            </div>
          ))}
        </div>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20"
        >
          重新开始
        </button>

        <p className="text-center text-slate-700 text-xs">
          本游戏场景改编自真实医患纠纷案例，仅供医学教育参考
        </p>
      </div>
    </div>
  )
}

function FinalStatBar({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-400 text-xs w-16">{label}</span>
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${Math.max(0, value)}%` }}
        />
      </div>
      <span className="text-slate-300 text-xs font-bold w-8 text-right">
        {value}
      </span>
    </div>
  )
}
