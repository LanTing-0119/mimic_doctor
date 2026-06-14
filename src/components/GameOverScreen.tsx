import type { Department, GameRecord, Scenario } from '../types'

interface GameOverScreenProps {
  department: Department | null
  scenarios: Scenario[]
  history: GameRecord[]
  score: number
  correctCount: number
  fatalCount: number
  totalCases: number
  onRestart: () => void
}

export function GameOverScreen({
  department,
  scenarios,
  history,
  score,
  correctCount,
  fatalCount,
  totalCases,
  onRestart,
}: GameOverScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 overflow-auto">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Score Banner */}
        <div className="text-center">
          <div className="text-6xl mb-4">
            {fatalCount > 0 ? '🏥' : correctCount === totalCases ? '🏆' : '📋'}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">模拟结束</h1>
          <p className="text-slate-400">
            {department} — {totalCases} 个病例
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="得分"
            value={`${Math.max(0, score)}`}
            color={score >= 20 ? 'text-emerald-400' : score >= 0 ? 'text-amber-400' : 'text-red-400'}
          />
          <StatCard label="正确" value={`${correctCount}/${totalCases}`} color="text-emerald-400" />
          <StatCard
            label="致死失误"
            value={`${fatalCount}`}
            color={fatalCount === 0 ? 'text-emerald-400' : 'text-red-400'}
          />
        </div>

        {/* Grade */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 text-center">
          <p className="text-slate-400 text-sm mb-1">综合评价</p>
          <p className="text-white text-xl font-bold">
            {fatalCount > 0
              ? '需要反思：每一次决策都可能关乎生死'
              : correctCount === totalCases
                ? '优秀！你展示了扎实的临床思维'
                : correctCount >= totalCases / 2
                  ? '良好，但仍需保持警惕'
                  : '继续加油，多思考，少盲从'}
          </p>
        </div>

        {/* Case-by-case review */}
        <div className="space-y-3">
          <h2 className="text-slate-400 text-sm font-semibold">回顾</h2>
          {history.map((record, i) => {
            const scenario = scenarios.find((s) => s.id === record.scenarioId)!
            const action = scenario.allActions.find((a) => a.id === record.chosenActionId)!
            return (
              <div
                key={i}
                className={`border rounded-xl p-4 ${
                  record.wasFatal
                    ? 'bg-red-950/20 border-red-800/30'
                    : record.wasCorrect
                      ? 'bg-emerald-950/20 border-emerald-800/30'
                      : 'bg-amber-950/20 border-amber-800/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium text-sm">{scenario.title}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      record.wasFatal
                        ? 'bg-red-600/20 text-red-400'
                        : record.wasCorrect
                          ? 'bg-emerald-600/20 text-emerald-400'
                          : 'bg-amber-600/20 text-amber-400'
                    }`}
                  >
                    {record.wasFatal ? '严重后果' : record.wasCorrect ? '正确' : '欠妥'}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">
                  选择：{action.label}
                  {record.wasDefault ? '（默认）' : '（思考后）'}
                </p>
              </div>
            )
          })}
        </div>

        <button
          onClick={onRestart}
          className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20"
        >
          再来一次
        </button>

        <p className="text-center text-slate-600 text-xs">
          本游戏仅供医学教育使用，不构成临床诊疗建议
        </p>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-slate-500 text-xs mt-1">{label}</p>
    </div>
  )
}
