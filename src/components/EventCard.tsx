import type { GameEvent } from '../types'

interface EventCardProps {
  event: GameEvent
  onChoose: (optionId: string) => void
}

export function EventCard({ event, onChoose }: EventCardProps) {
  return (
    <div className="flex-1 overflow-auto px-3 sm:px-4 py-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Category badge */}
        <span className="inline-block bg-slate-800 text-slate-500 text-xs px-2.5 py-1 rounded-full border border-slate-700/50">
          {event.category}
        </span>

        {/* Title */}
        <h2 className="text-white text-lg sm:text-xl font-bold leading-snug">
          {event.title}
        </h2>

        {/* Event Image - convention: /images/{eventId}.webp */}
        <div className="rounded-xl overflow-hidden border border-slate-700/50 bg-slate-800/20">
          <img
            src={`/images/${event.id}.webp`}
            alt={event.title}
            className="w-full max-h-56 sm:max-h-80 object-contain bg-black/40"
            loading="lazy"
            onError={(e) => {
              const el = e.currentTarget
              el.parentElement!.style.display = 'none'
            }}
          />
        </div>

        {/* Description */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {event.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onChoose(option.id)}
              className="w-full text-center py-3.5 px-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50 active:scale-[0.99] transition-all"
            >
              <span className="text-white text-sm">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
