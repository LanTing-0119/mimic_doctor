import type { GameState, PlayerStats, CareerStage } from '../types'
import { STAGE_NAMES } from '../types'
import { StatsBar } from './StatsBar'
import { EventCard } from './EventCard'
import { OutcomeModal } from './OutcomeModal'

function OutcomeModalWrapper({
  lastChoice,
  stats,
  stage,
  isLastEvent,
  onDismiss,
}: {
  lastChoice: NonNullable<GameState['lastChoice']>
  stats: PlayerStats
  stage: CareerStage
  isLastEvent: boolean
  onDismiss: () => void
}) {
  const effect = lastChoice.option.statsEffect
  const oldStats = {
    reputation: stats.reputation - (effect.reputation ?? 0),
    safety: stats.safety - (effect.safety ?? 0),
    mental: stats.mental - (effect.mental ?? 0),
    support: stats.support - (effect.support ?? 0),
    legalRisk: stats.legalRisk - (effect.legalRisk ?? 0),
  }
  return (
    <OutcomeModal
      event={lastChoice.event}
      option={lastChoice.option}
      stats={stats}
      oldStats={oldStats}
      stage={stage}
      isLastEvent={isLastEvent}
      onDismiss={onDismiss}
    />
  )
}

interface GameScreenProps {
  state: GameState
  currentEvent: NonNullable<ReturnType<typeof import('../hooks/useGameState').useGameState>['currentEvent']>
  progress: { current: number; total: number }
  onChoose: (eventId: string, optionId: string) => void
  onDismissOutcome: () => void
  onStartStage: () => void
}

export function GameScreen({
  state,
  currentEvent,
  progress,
  onChoose,
  onDismissOutcome,
  onStartStage,
}: GameScreenProps) {
  const needsNewStage =
    state.phase === 'PLAYING' && state.events.length === 0

  if (needsNewStage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-4"
        style={state.stage !== '住院医师' ? {} : {}}>
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl">
            {state.stage === '主治医师' ? '📈' : '🏅'}
          </div>
          <h2 className="text-2xl font-bold text-white">
            晋升：{STAGE_NAMES[state.stage]}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {state.stage === '主治医师'
              ? '你升了主治。责任更大了，面对的患者和家属也更复杂了。新的挑战在等着你。'
              : state.stage === '副主任医师'
                ? '你成为了副主任医师。现在你是科室的中坚力量，更多人盯着你——患者、家属、媒体、卫健委。每一步都要谨慎。'
                : '你的行医生涯开始了。记住：医术是基础，但保护好自己同样重要。'}
          </p>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-left space-y-2">
            <p className="text-slate-400 text-sm">当前属性：</p>
            <div className="grid grid-cols-5 gap-2 text-center">
              {[
                { label: '声誉', v: state.stats.reputation, c: 'text-blue-400' },
                { label: '安全', v: state.stats.safety, c: 'text-emerald-400' },
                { label: '心理', v: state.stats.mental, c: 'text-amber-400' },
                { label: '支持', v: state.stats.support, c: 'text-purple-400' },
                { label: '法律', v: 100 - state.stats.legalRisk, c: 'text-red-400' },
              ].map((s) => (
                <div key={s.label}>
                  <p className={`font-bold ${s.c}`}>{s.v}</p>
                  <p className="text-slate-600 text-[10px]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={onStartStage}
            className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20"
          >
            进入{STAGE_NAMES[state.stage]}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col">
      <StatsBar
        stats={state.stats}
        playerName={state.playerName}
        stage={state.stage}
        progress={progress}
      />

      {currentEvent && (
        <EventCard
          event={currentEvent}
          onChoose={(optionId) => onChoose(currentEvent.id, optionId)}
        />
      )}

      {state.phase === 'OUTCOME' && state.lastChoice && (
        <OutcomeModalWrapper
          lastChoice={state.lastChoice}
          stats={state.stats}
          stage={state.stage}
          isLastEvent={state.currentEventIndex + 1 >= state.events.length}
          onDismiss={onDismissOutcome}
        />
      )}
    </div>
  )
}
