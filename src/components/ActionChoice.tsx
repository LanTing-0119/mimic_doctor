import type { Scenario, Action } from '../types'

interface ActionChoiceProps {
  scenario: Scenario
  thinking: boolean
  caseNumber: number
  totalCases: number
  onChooseDefault: () => void
  onThink: () => void
  onChooseAction: (actionId: string) => void
}

export function ActionChoice({
  scenario,
  thinking,
  caseNumber,
  totalCases,
  onChooseDefault,
  onThink,
  onChooseAction,
}: ActionChoiceProps) {
  const { patient, history, physicalExam, auxiliaryTests, defaultAction, allActions } = scenario

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-slate-400 text-sm">
            病例 {caseNumber} / {totalCases}
          </span>
          <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">
            {scenario.department}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Patient Info */}
          <div>
            <h2 className="text-white text-xl font-bold mb-1">{scenario.title}</h2>
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <span>
                {patient.gender}，{patient.age}岁
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400 font-medium">主诉：{patient.chiefComplaint}</span>
            </div>
          </div>

          {/* Case Details */}
          <div className="space-y-3">
            <CaseSection title="现病史" content={history} />
            <CaseSection title="体格检查" content={physicalExam} />
            <CaseSection title="辅助检查" content={auxiliaryTests} />
          </div>

          {/* Action Area */}
          <div className="border-t border-slate-700/50 pt-5 space-y-4">
            <p className="text-slate-400 text-sm font-medium">
              系统建议的默认操作：
            </p>

            {/* Default Action Card */}
            <div className="bg-slate-800 border border-amber-800/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-amber-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 text-xs">!</span>
                </div>
                <div>
                  <p className="text-amber-100 font-medium">{defaultAction.label}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    请判断此操作是否恰当，或点击"思考"查看更多选项
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            {!thinking ? (
              <div className="flex gap-3">
                <button
                  onClick={onChooseDefault}
                  className="flex-1 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-base hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20"
                >
                  执行此操作
                </button>
                <button
                  onClick={onThink}
                  className="flex-1 py-3.5 rounded-xl bg-amber-600/20 border border-amber-700/30 text-amber-300 font-bold text-base hover:bg-amber-600/30 active:scale-[0.98] transition-all"
                >
                  🤔 思考一下
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-slate-400 text-sm">请选择一个操作：</p>
                {allActions.map((action) => (
                  <ActionOption
                    key={action.id}
                    action={action}
                    isDefault={action.id === defaultAction.id}
                    onChoose={() => onChooseAction(action.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CaseSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
        {title}
      </h3>
      <p className="text-slate-300 text-sm leading-relaxed">{content}</p>
    </div>
  )
}

function ActionOption({
  action,
  isDefault,
  onChoose,
}: {
  action: Action
  isDefault: boolean
  onChoose: () => void
}) {
  return (
    <button
      onClick={onChoose}
      className={`w-full text-left p-4 rounded-xl border transition-all hover:border-slate-500 active:scale-[0.98] ${
        isDefault
          ? 'bg-amber-900/20 border-amber-700/30'
          : 'bg-slate-800/50 border-slate-700/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`font-medium ${isDefault ? 'text-amber-100' : 'text-white'}`}>
          {action.label}
        </span>
        {isDefault && (
          <span className="text-xs bg-amber-600/20 text-amber-400 px-2 py-0.5 rounded-full">
            默认
          </span>
        )}
      </div>
    </button>
  )
}
