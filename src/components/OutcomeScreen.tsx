import type { Scenario, Action } from '../types'

interface OutcomeScreenProps {
  scenario: Scenario
  chosenAction: Action
  wasCorrect: boolean
  wasFatal: boolean
  isLastCase: boolean
  onNext: () => void
}

export function OutcomeScreen({
  scenario,
  chosenAction,
  wasCorrect,
  wasFatal,
  isLastCase,
  onNext,
}: OutcomeScreenProps) {
  return (
    <div className="min-h-screen bg-slate-900 overflow-auto">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Result Banner */}
        <div
          className={`rounded-2xl p-6 text-center ${
            wasFatal
              ? 'bg-red-950/50 border border-red-800/30'
              : wasCorrect
                ? 'bg-emerald-950/50 border border-emerald-800/30'
                : 'bg-amber-950/50 border border-amber-800/30'
          }`}
        >
          <div className="text-5xl mb-3">
            {wasFatal ? '💀' : wasCorrect ? '✅' : '⚠️'}
          </div>
          <h2
            className={`text-2xl font-bold mb-2 ${
              wasFatal ? 'text-red-400' : wasCorrect ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {wasFatal ? '严重后果！' : wasCorrect ? '处理正确' : '处理欠妥'}
          </h2>
          <p className="text-slate-300 text-lg font-medium">
            你选择了：{chosenAction.label}
          </p>
        </div>

        {/* Outcome */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            临床结果
          </h3>
          <p
            className={`text-base leading-relaxed ${
              wasFatal ? 'text-red-300' : 'text-slate-300'
            }`}
          >
            {chosenAction.outcome}
          </p>
        </div>

        {/* Communication Tip */}
        {chosenAction.communicationTip && (
          <div className="bg-blue-950/30 border border-blue-800/30 rounded-xl p-5">
            <h3 className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              沟通要点
            </h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              {chosenAction.communicationTip}
            </p>
          </div>
        )}

        {/* Explanation */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            知识点
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">{scenario.explanation}</p>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20"
        >
          {isLastCase ? '查看总结' : '下一题'}
        </button>
      </div>
    </div>
  )
}
