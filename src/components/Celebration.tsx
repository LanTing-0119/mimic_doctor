import { useEffect, useState } from 'react'

const FLOWERS = ['💐', '🌸', '🌺', '🌷', '🌻', '🌼', '💮', '🏵️']
const COUNT = 24

interface Particle {
  id: number
  emoji: string
  fromLeft: boolean
  y: number
  delay: number
  duration: number
  size: number
}

export function Celebration({ onDone }: { onDone: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const items: Particle[] = []
    for (let i = 0; i < COUNT; i++) {
      items.push({
        id: i,
        emoji: FLOWERS[i % FLOWERS.length],
        fromLeft: i < COUNT / 2,
        y: 10 + Math.random() * 80,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1.5,
        size: 1 + Math.random() * 2,
      })
    }
    setParticles(items)

    const timer = setTimeout(() => {
      setVisible(false)
      onDone()
    }, 2500)

    return () => clearTimeout(timer)
  }, [onDone])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute"
          style={{
            left: p.fromLeft ? '-8%' : '108%',
            top: `${p.y}%`,
            fontSize: `${p.size}rem`,
            animation: `flowerFly ${p.duration}s ease-out ${p.delay}s forwards`,
            opacity: 0,
            '--dir': p.fromLeft ? '1' : '-1',
          } as React.CSSProperties}
        >
          {p.emoji}
        </span>
      ))}
      <style>{`
        @keyframes flowerFly {
          0% { opacity: 0; transform: translateX(0) rotate(0deg) scale(0.3); }
          20% { opacity: 1; transform: translateX(calc(var(--dir) * 30vw)) rotate(30deg) scale(1.3); }
          60% { opacity: 0.8; transform: translateX(calc(var(--dir) * 55vw)) rotate(-15deg) scale(1); }
          100% { opacity: 0; transform: translateX(calc(var(--dir) * 80vw)) rotate(360deg) scale(0.2); }
        }
      `}</style>
    </div>
  )
}
