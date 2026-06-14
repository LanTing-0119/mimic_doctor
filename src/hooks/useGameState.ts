import { useReducer, useCallback } from 'react'
import type { GameState, GameEvent, GameRecord, PlayerStats, CareerStage } from '../types'
import { INITIAL_STATS } from '../types'
import { allEvents } from '../data/events'

const EVENTS_PER_STAGE = 6

type Action =
  | { type: 'CREATE_CHARACTER'; name: string }
  | { type: 'START_STAGE' }
  | { type: 'CHOOSE_OPTION'; eventId: string; optionId: string }
  | { type: 'DISMISS_OUTCOME' }
  | { type: 'RESTART' }

function clampStats(stats: PlayerStats): PlayerStats {
  return {
    reputation: Math.max(0, Math.min(100, stats.reputation)),
    safety: Math.max(0, Math.min(100, stats.safety)),
    mental: Math.max(0, Math.min(100, stats.mental)),
    support: Math.max(0, Math.min(100, stats.support)),
    legalRisk: Math.max(0, Math.min(100, stats.legalRisk)),
  }
}

function shuffleAndPick(events: GameEvent[], count: number): GameEvent[] {
  const shuffled = [...events].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function getNextStage(stage: CareerStage): CareerStage | null {
  if (stage === '住院医师') return '主治医师'
  if (stage === '主治医师') return '副主任医师'
  return null
}

function hasAnyZero(stats: PlayerStats): boolean {
  return stats.reputation <= 0 || stats.safety <= 0 || stats.mental <= 0
}

function createInitialState(): GameState {
  return {
    phase: 'CREATE',
    stage: '住院医师',
    playerName: '',
    stats: { ...INITIAL_STATS },
    currentEventIndex: 0,
    events: [],
    history: [],
    lastChoice: null,
  }
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'CREATE_CHARACTER': {
      return {
        ...createInitialState(),
        phase: 'PLAYING',
        playerName: action.name,
      }
    }

    case 'START_STAGE': {
      const stageEvents = allEvents.filter((e) => e.stage === state.stage)
      const selected = shuffleAndPick(stageEvents, EVENTS_PER_STAGE)
      return {
        ...state,
        phase: 'PLAYING',
        events: selected,
        currentEventIndex: 0,
        lastChoice: null,
      }
    }

    case 'CHOOSE_OPTION': {
      const event = state.events[state.currentEventIndex]
      const option = event.options.find((o) => o.id === action.optionId)
      if (!option) return state

      const newStats = clampStats({
        reputation: state.stats.reputation + (option.statsEffect.reputation ?? 0),
        safety: state.stats.safety + (option.statsEffect.safety ?? 0),
        mental: state.stats.mental + (option.statsEffect.mental ?? 0),
        support: state.stats.support + (option.statsEffect.support ?? 0),
        legalRisk: state.stats.legalRisk + (option.statsEffect.legalRisk ?? 0),
      })

      const record: GameRecord = {
        eventId: event.id,
        eventTitle: event.title,
        chosenOptionId: option.id,
        chosenLabel: option.label,
        outcome: option.outcome,
        statsEffect: option.statsEffect,
        wasRecommended: option.isRecommended,
      }

      return {
        ...state,
        phase: 'OUTCOME',
        stats: newStats,
        history: [...state.history, record],
        lastChoice: { event, option },
      }
    }

    case 'DISMISS_OUTCOME': {
      const nextIndex = state.currentEventIndex + 1

      if (hasAnyZero(state.stats)) {
        return { ...state, phase: 'ENDING' }
      }

      if (nextIndex >= state.events.length) {
        const nextStage = getNextStage(state.stage)
        if (!nextStage) {
          return { ...state, phase: 'ENDING' }
        }
        return {
          ...state,
          phase: 'PLAYING',
          stage: nextStage,
          currentEventIndex: 0,
          events: [],
          lastChoice: null,
        }
      }

      return {
        ...state,
        phase: 'PLAYING',
        currentEventIndex: nextIndex,
        lastChoice: null,
      }
    }

    case 'RESTART': {
      return createInitialState()
    }

    default:
      return state
  }
}

function determineEnding(stats: PlayerStats): {
  title: string
  description: string
  emoji: string
} {
  if (stats.safety <= 10) {
    return {
      title: '💀 英年早逝',
      emoji: '💀',
      description:
        '你在一次医患冲突中受到了严重的人身伤害。你的名字出现在了新闻头条上，同行为你默哀，但很快被遗忘。你的家人拿到了抚恤金，但这远不能弥补失去你的痛苦。\n\n记住：没有什么工作值得你用生命去守护。下次面对暴怒的家属，先报警，先撤离，先保护好自己。李晟医生的悲剧不该再重演。',
    }
  }
  if (stats.legalRisk >= 90) {
    return {
      title: '🔒 铁窗泪',
      emoji: '🔒',
      description:
        '你被以"医疗事故罪"判处有期徒刑。你的执业证书被吊销，职业生涯戛然而止。在法庭上，你回想这一切是怎么发生的——可能只是一个没有签字的知情同意书，一句在调查中说错的话，一次妥协的"私了"。\n\n医疗行业，一步走错就可能万劫不复。记住：知情同意、病历记录、法律咨询，这三样东西是你的护身符。',
    }
  }
  if (stats.mental <= 20) {
    return {
      title: '😷 职业倦怠',
      emoji: '😷',
      description:
        '你再也无法忍受了。每天早上穿上白大褂的时候，你感到的不是使命感，而是恐惧和厌恶。你开始失眠、焦虑、对病人冷漠。你递交了辞职信，离开了你曾经热爱的职业。\n\n医者的心也会受伤。学会求助，学会设定边界，学会在保护自己的同时保护他人。你的离职不是你的失败，是这个体系没能保护好它的守护者。',
    }
  }
  if (stats.reputation <= 20) {
    return {
      title: '📱 社死退网',
      emoji: '📱',
      description:
        '你的名字在网络上成了"恶医生"的代名词。虽然你是被冤枉的，但在短视频时代，真相永远跑不过谣言。你的门诊量降到零，没有患者愿意找你看病。你选择了注销所有社交账号，转到行政岗位，从此远离临床。\n\n在流量面前，个人是渺小的。好在，你不是一个人——你还有医院、还有法律、还有同行。下次被网暴时，第一时间找宣传科，找律师，而不要自己扛。',
    }
  }
  if (stats.reputation >= 80 && stats.safety >= 60 && stats.mental >= 50 && stats.legalRisk <= 20) {
    return {
      title: '🏆 德高望重',
      emoji: '🏆',
      description:
        '你成功地在这个复杂危险的医疗环境中生存了下来，并且赢得了患者和同行的尊重。你有扎实的医术，有保护自己的智慧，有化解冲突的能力，有守住底线的原则。\n\n你的职业生涯还很长，挑战还会继续。但你已经学会了最重要的一课：保护好自己，才能更好地保护病人。',
    }
  }
  if (stats.safety >= 70 && stats.legalRisk <= 30) {
    return {
      title: '🛡️ 全身而退',
      emoji: '🛡️',
      description:
        '你没有成为"名医"，但你也没有成为"牺牲品"。你知道什么时候该说"不"，什么时候该求助，什么时候该让步。你在这个系统中找到了平衡——不伟大，但安全。你每天能按时回家，能吃上热饭，能在周末陪家人。\n\n也许这不是最耀眼的结局，但对很多医生来说，这已经是奢侈品了。平安是福。',
    }
  }
  if (stats.mental <= 30 || stats.reputation <= 40) {
    return {
      title: '🏃 转行保命',
      emoji: '🏃',
      description:
        '你最终选择了离开。不是因为你不够好，而是因为你太累了。你去了药企做医学顾问，或者去了医学院做老师，或者完全转行。你的同学说"可惜了"，但只有你自己知道，离开是真正的解脱。\n\n转行不是失败。在一个不能让医生安心行医的环境里，保护自己比坚守更有勇气。',
    }
  }
  return {
    title: '📋 平凡之路',
    emoji: '📋',
    description:
      '你的职业生涯还在继续。有起有落，有委屈也有欣慰。你没有成为传奇，但你还在坚持。每一天你都在学习和成长，在保护自己的同时尽力帮助每一个走进你诊室的病人。\n\n这条路还很长。希望你在未来的行医生涯中，能记住这个游戏教会你的东西。',
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState)

  const currentEvent = state.events[state.currentEventIndex] ?? null
  const progress = state.events.length > 0
    ? { current: state.currentEventIndex + 1, total: state.events.length }
    : { current: 0, total: 0 }

  const ending = state.phase === 'ENDING' ? determineEnding(state.stats) : null

  const recommendedCount = state.history.filter((r) => r.wasRecommended).length
  const totalChoices = state.history.length

  const createCharacter = useCallback(
    (name: string) => dispatch({ type: 'CREATE_CHARACTER', name }),
    [],
  )
  const startStage = useCallback(() => dispatch({ type: 'START_STAGE' }), [])
  const chooseOption = useCallback(
    (eventId: string, optionId: string) =>
      dispatch({ type: 'CHOOSE_OPTION', eventId, optionId }),
    [],
  )
  const dismissOutcome = useCallback(
    () => dispatch({ type: 'DISMISS_OUTCOME' }),
    [],
  )
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), [])

  return {
    state,
    dispatch,
    currentEvent,
    progress,
    ending,
    recommendedCount,
    totalChoices,
    createCharacter,
    startStage,
    chooseOption,
    dismissOutcome,
    restart,
  }
}
