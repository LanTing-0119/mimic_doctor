import type { GameEvent } from '../types'

interface EventCardProps {
  event: GameEvent
  onChoose: (optionId: string) => void
}

export function EventCard({ event, onChoose }: EventCardProps) {
  return (
    <div className="flex-1 overflow-auto px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Category badge */}
        <div className="flex items-center gap-2">
          <span className="bg-slate-800 text-slate-400 text-xs px-2.5 py-1 rounded-full border border-slate-700/50">
            {event.category}
          </span>
          {event.isRealCase && (
            <span className="bg-red-950/30 text-red-400 text-xs px-2.5 py-1 rounded-full border border-red-800/30">
              真实案例改编
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-white text-xl font-bold leading-snug">
          {event.title}
        </h2>

        {/* Event Image - convention: /images/{eventId}.webp */}
        <div className="rounded-xl overflow-hidden border border-slate-700/50 bg-slate-800/20">
          <img
            src={`/images/${event.id}.webp`}
            alt={event.title}
            className="w-full max-h-80 object-contain bg-black/40"
            loading="lazy"
            onError={(e) => {
              // Hide image container if image doesn't exist
              const el = e.currentTarget
              el.parentElement!.style.display = 'none'
            }}
          />
        </div>

        {/* Description */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
          <p className="text-slate-300 text-base leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Real case reference */}
        {event.realCaseRef && (
          <p className="text-slate-600 text-xs">
            真实案例参考：{event.realCaseRef}
          </p>
        )}

        {/* Options */}
        <div className="space-y-3">
          <p className="text-slate-400 text-sm font-medium">你决定：</p>
          {event.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onChoose(option.id)}
              className="w-full text-left p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50 active:scale-[0.99] transition-all group"
            >
              <p className="text-white text-sm leading-relaxed group-hover:text-white">
                {option.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
