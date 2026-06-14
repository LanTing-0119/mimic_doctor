import { useState } from 'react'
import type { CareerStage } from '../types'
import { INITIAL_STATS, STAGE_NAMES } from '../types'

interface StartScreenProps {
  playerName: string
  stage: CareerStage
  onStart: (name: string) => void
}

export function StartScreen({ playerName, stage, onStart }: StartScreenProps) {
  const [name, setName] = useState(playerName || '')

  const handleStart = () => {
    const finalName = name.trim() || '青年医生'
    onStart(finalName)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-sm w-full space-y-6">
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="text-6xl">🩺</div>
          <h1 className="text-3xl font-bold text-white tracking-wide">
            白袍之下
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            穿上白大褂的第一天，没人告诉你——<br />
            最难的不是治病，是
            <span className="text-slate-400">活着走出诊室</span>。
          </p>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg px-4 py-3 text-xs text-slate-500 text-left space-y-1.5">
            <p>今晚的病房里，有人在等你犯错。</p>
            <p>走廊尽头，摄像机已经架好了。</p>
            <p>而你唯一的选择，就是——</p>
            <p className="text-amber-100/80 font-medium">选对，或者活下去。</p>
          </div>
        </div>

        {/* Name input */}
        <div className="bg-slate-800/20 border border-slate-700/40 rounded-lg p-4 space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="你的名字"
            maxLength={8}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors text-center text-lg"
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />

          <div className="grid grid-cols-5 gap-1 text-center">
            <StatPreview label="声誉" value={INITIAL_STATS.reputation} color="text-blue-400" />
            <StatPreview label="安全" value={INITIAL_STATS.safety} color="text-emerald-400" />
            <StatPreview label="心理" value={INITIAL_STATS.mental} color="text-amber-400" />
            <StatPreview label="支持" value={INITIAL_STATS.support} color="text-purple-400" />
            <StatPreview label="法律" value={100 - INITIAL_STATS.legalRisk} color="text-red-400" />
          </div>

          <p className="text-slate-600 text-[11px] text-center">
            {STAGE_NAMES[stage]} · 你的每个选择都在重塑命运
          </p>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-xl bg-emerald-700 text-white font-bold text-lg hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-900/30"
        >
          开始值班
        </button>

        <p className="text-center text-slate-700 text-[10px]">
          改编自真实案例 · 有8种不同结局
        </p>
      </div>
    </div>
  )
}

function StatPreview({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
      <p className="text-slate-600 text-[9px] leading-tight">{label}</p>
    </div>
  )
}
