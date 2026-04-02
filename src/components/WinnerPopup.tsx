'use client'
import { useGameStore } from '@/store/game-store'

// Fixed particle definitions — no random at render time to avoid hydration mismatch
const PARTICLES: { char: string; left: number; delay: number; duration: number; size: number }[] = [
  { char: '✦', left: 10, delay: 0,    duration: 1.4, size: 18 },
  { char: '◆', left: 22, delay: 0.15, duration: 1.7, size: 12 },
  { char: '★', left: 38, delay: 0.05, duration: 1.5, size: 22 },
  { char: '✦', left: 52, delay: 0.3,  duration: 1.3, size: 14 },
  { char: '◆', left: 65, delay: 0.1,  duration: 1.6, size: 10 },
  { char: '★', left: 78, delay: 0.25, duration: 1.8, size: 20 },
  { char: '✦', left: 88, delay: 0.08, duration: 1.4, size: 16 },
  { char: '◆', left: 5,  delay: 0.35, duration: 1.5, size: 11 },
  { char: '★', left: 95, delay: 0.2,  duration: 1.7, size: 13 },
]

export function WinnerPopup() {
  const winnerName = useGameStore(s => s.winnerName)
  const dismissWinner = useGameStore(s => s.dismissWinner)

  if (!winnerName) return null

  return (
    <div
      className="fixed inset-0 bg-ink/85 z-50 flex items-center justify-center overflow-hidden"
      style={{ animation: 'fade-in 0.2s ease both' }}
    >
      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-1/3 pointer-events-none select-none text-bg"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            animation: `particle-rise ${p.duration}s ${p.delay}s ease-out both`,
          }}
        >
          {p.char}
        </span>
      ))}

      <div
        className="bg-paper border-2 border-ink p-8 text-center max-w-xs w-[90%] flex flex-col gap-6 relative"
        style={{ animation: 'winner-bounce-in 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <p className="text-xs tracking-[0.15em] uppercase text-ink-light font-mono">Winner</p>
          <p className="font-display font-black text-4xl leading-tight break-words">{winnerName}</p>
        </div>

        <button
          onClick={dismissWinner}
          className="py-5 border-2 border-ink bg-ink text-bg hover:opacity-80 font-mono text-sm tracking-widest transition-opacity cursor-pointer"
        >
          VIEW STATS
        </button>
      </div>
    </div>
  )
}
