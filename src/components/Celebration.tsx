import { useEffect, useState } from 'react'

const FLOWERS = ['💐', '🌸', '🌺', '🌷', '🌻', '🌼', '💮', '🏵️']
const COUNT = 30

interface Particle {
  id: number
  emoji: string
  x: number
  delay: number
  duration: number
  size: number
  rotation: number
}

export function Celebration({ onDone }: { onDone: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const items: Particle[] = []
    for (let i = 0; i < COUNT; i++) {
      items.push({
        id: i,
        emoji: FLOWERS[Math.floor(Math.random() * FLOWERS.length)],
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.5 + Math.random() * 2,
        size: 1 + Math.random() * 2.5,
        rotation: -30 + Math.random() * 60,
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
            left: `${p.x}%`,
            bottom: '-10%',
            fontSize: `${p.size}rem`,
            animation: `flowerRise ${p.duration}s ease-out ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0,
          }}
        >
          {p.emoji}
        </span>
      ))}
      <style>{`
        @keyframes flowerRise {
          0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0.5); }
          15% { opacity: 1; transform: translateY(-15vh) rotate(15deg) scale(1.2); }
          100% { opacity: 0; transform: translateY(-100vh) rotate(720deg) scale(0.3); }
        }
      `}</style>
    </div>
  )
}
