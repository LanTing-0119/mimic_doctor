export interface PlayerStats {
  reputation: number
  safety: number
  mental: number
  support: number
  legalRisk: number
}

export type CareerStage = '住院医师' | '主治医师' | '副主任医师'

export type EventCategory =
  | '诊室暗流'
  | '病房风暴'
  | '手术室边缘'
  | '网络暴力'
  | '制度博弈'
  | '法律雷区'

export interface EventOption {
  id: string
  label: string
  outcome: string
  statsEffect: Partial<PlayerStats>
  isRecommended: boolean
  tip: string
}

export interface GameEvent {
  id: string
  stage: CareerStage
  category: EventCategory
  title: string
  description: string
  isRealCase: boolean
  realCaseRef?: string
  imagePrompt?: string
  options: EventOption[]
}

export interface GameRecord {
  eventId: string
  eventTitle: string
  chosenOptionId: string
  chosenLabel: string
  outcome: string
  statsEffect: Partial<PlayerStats>
  wasRecommended: boolean
}

export type GamePhase = 'CREATE' | 'PLAYING' | 'OUTCOME' | 'ENDING'

export interface GameState {
  phase: GamePhase
  stage: CareerStage
  playerName: string
  stats: PlayerStats
  currentEventIndex: number
  events: GameEvent[]
  history: GameRecord[]
  lastChoice: { event: GameEvent; option: EventOption } | null
}

export const INITIAL_STATS: PlayerStats = {
  reputation: 60,
  safety: 70,
  mental: 80,
  support: 50,
  legalRisk: 10,
}

export const STAGE_NAMES: Record<CareerStage, string> = {
  '住院医师': '第一年住院医师',
  '主治医师': '第三年主治医师',
  '副主任医师': '第五年副主任医师',
}
