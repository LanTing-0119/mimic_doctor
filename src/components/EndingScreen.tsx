import { useState, useEffect } from 'react'
import type { PlayerStats, GameRecord, CareerStage } from '../types'
import { Celebration } from './Celebration'

const AMOUNTS = ['花花', '2元', '5元', '10元', '自定义']
const COUNTER_KEY = 'btwc_played'

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
  const [paidAmount, setPaidAmount] = useState<string | null>(null)
  const [showFlowerThank, setShowFlowerThank] = useState(false)
  const [totalPlays, setTotalPlays] = useState<number>(() => {
    const stored = localStorage.getItem(COUNTER_KEY + '_total')
    return stored ? Number(stored) : 0
  })

  useEffect(() => {
    const alreadyPlayed = localStorage.getItem(COUNTER_KEY)
    const now = Date.now()
    if (!alreadyPlayed || now - Number(alreadyPlayed) > 86400000) {
      const newTotal = totalPlays + 1
      localStorage.setItem(COUNTER_KEY, String(now))
      localStorage.setItem(COUNTER_KEY + '_total', String(newTotal))
      setTotalPlays(newTotal)
    }
    // Try remote counter in background (may not work in China)
    fetch('https://api.counterapi.dev/v1/beneath-the-white-coat/plays/up', { mode: 'no-cors' }).catch(() => {})
  }, [])

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
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-2.5">
            <p className="text-lg font-bold text-white">{stage}</p>
            <p className="text-slate-500 text-[10px]">到达阶段</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-2.5">
            <p className="text-lg font-bold text-emerald-400">
              {totalChoices > 0
                ? Math.round((recommendedCount / totalChoices) * 100)
                : 0}%
            </p>
            <p className="text-slate-500 text-[10px]">明智选择率</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-2.5">
            <p className="text-lg font-bold text-amber-400">{totalChoices}</p>
            <p className="text-slate-500 text-[10px]">事件经历</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-2.5">
            <p className="text-lg font-bold text-rose-400">
              {totalPlays.toLocaleString()}
            </p>
            <p className="text-slate-500 text-[10px]">我的游玩</p>
          </div>
        </div>

        {/* Ending hint */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-center space-y-2">
          <p className="text-slate-300 text-sm font-medium">你只体验了 <span className="text-amber-400 font-bold text-lg">1/8</span> 种结局</p>
          <p className="text-slate-500 text-xs leading-relaxed">
            每个选择都在暗中标好了代价。<br />
            换一种决策，换一个命运。<br />
            再值一次班，试试不同的路。
          </p>
        </div>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-xl bg-emerald-700 text-white font-bold text-lg hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-900/30"
        >
          再值一次班
        </button>

        {/* Support */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 space-y-4">
          <p className="text-slate-400 text-sm text-center">觉得有点意思？请作者喝杯咖啡 ☕️</p>

          {/* Flower celebration */}
          {showFlowerThank && (
            <Celebration
              onDone={() => setShowFlowerThank(false)}
            />
          )}

          {/* Amount buttons - always visible (unless showing QR codes for paid amount) */}
          {!paidAmount && (
            <div className="flex gap-2 justify-center flex-wrap">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    if (a === '花花') {
                      setShowFlowerThank(true)
                    } else {
                      setPaidAmount(a)
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-amber-300 text-sm font-medium hover:bg-slate-700 hover:border-amber-600/50 active:scale-95 transition-all"
                >
                  {a}
                </button>
              ))}
            </div>
          )}

          {/* Thank you message for 花花 */}
          {showFlowerThank && (
            <p className="text-emerald-400 text-xs text-center animate-pulse">谢谢你的花花 🌸</p>
          )}

          {/* QR codes for paid amounts */}
          {paidAmount && (
            <>
              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  你选了 <span className="text-amber-400 font-bold">{paidAmount}</span>
                </p>
                <button
                  onClick={() => setPaidAmount(null)}
                  className="text-slate-600 text-xs mt-1 hover:text-slate-400"
                >
                  重新选择
                </button>
              </div>
              <p className="text-slate-500 text-[11px] text-center leading-relaxed">
                长按二维码 → 保存图片 →<br />打开微信/支付宝扫一扫 → 相册选取
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center space-y-1">
                  <a href={`${import.meta.env.BASE_URL}wechat-pay.jpg`} download className="block">
                    <img src={`${import.meta.env.BASE_URL}wechat-pay.jpg`} alt="微信赞赏码" className="w-full rounded-lg" />
                  </a>
                  <p className="text-slate-500 text-[10px]">微信 · 长按保存</p>
                </div>
                <div className="text-center space-y-1">
                  <a href={`${import.meta.env.BASE_URL}alipay.jpg`} download className="block">
                    <img src={`${import.meta.env.BASE_URL}alipay.jpg`} alt="支付宝收款码" className="w-full rounded-lg" />
                  </a>
                  <p className="text-slate-500 text-[10px]">支付宝 · 长按保存</p>
                </div>
              </div>
            </>
          )}
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

        <p className="text-center text-slate-700 text-[10px]">
          改编自真实案例 · 已有 <span id="busuanzi_value_page_pv" className="text-slate-500">-</span> 人探索过此地
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
