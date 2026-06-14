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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="text-7xl mb-4">⚕️</div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            医者自保
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            一个关于如何在医疗系统中
            <span className="text-amber-400 font-medium">生存下去</span>
            的游戏
          </p>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-left text-sm text-slate-400 space-y-1">
            <p>在这个游戏里，你将面对：</p>
            <p>• 偷偷录音的患者</p>
            <p>• 醉酒闹事的家属</p>
            <p>• 断章取义的短视频</p>
            <p>• 同事甩锅的瞬间</p>
            <p>• 法律风险的逼近</p>
            <p className="text-amber-400 mt-2">每一个选择，都可能改变你的职业生涯——甚至你的生命。</p>
          </div>
        </div>

        {/* Name input */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 space-y-4">
          <label className="block text-slate-300 text-sm font-medium">
            你的名字
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入你的医生名字..."
            maxLength={12}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors text-lg"
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />

          <div className="bg-slate-900/50 rounded-lg p-4 space-y-2">
            <p className="text-slate-500 text-xs uppercase tracking-wider">
              初始属性
            </p>
            <div className="grid grid-cols-5 gap-2 text-center">
              <StatPreview
                label="职业声誉"
                value={INITIAL_STATS.reputation}
                color="text-blue-400"
              />
              <StatPreview
                label="安全指数"
                value={INITIAL_STATS.safety}
                color="text-emerald-400"
              />
              <StatPreview
                label="心理状态"
                value={INITIAL_STATS.mental}
                color="text-amber-400"
              />
              <StatPreview
                label="科室支持"
                value={INITIAL_STATS.support}
                color="text-purple-400"
              />
              <StatPreview
                label="法律风险"
                value={INITIAL_STATS.legalRisk}
                color="text-red-400"
              />
            </div>
          </div>

          <p className="text-slate-600 text-xs text-center">
            你将扮演一名{STAGE_NAMES[stage]}，每个阶段将随机抽取6个事件
          </p>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-xl hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20"
        >
          开始行医
        </button>

        <p className="text-center text-slate-700 text-xs">
          本游戏场景改编自真实医患纠纷案例，仅供医学教育参考
        </p>
      </div>
    </div>
  )
}

function StatPreview({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-slate-600 text-[10px] leading-tight">{label}</p>
    </div>
  )
}
