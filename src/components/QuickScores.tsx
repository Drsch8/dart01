'use client'
import { useGameStore } from '@/store/game-store'
import { QUICK_SCORE_VALUES, QUICK_SCORE_LABELS, FKEY_LABELS, REM_SENTINEL } from '@/lib/constants'

export function QuickScores() {
  const quickScore = useGameStore(s => s.quickScore)
  const inputMode = useGameStore(s => s.inputMode)

  return (
    <div className="grid grid-cols-6 md:grid-cols-12 gap-px bg-rule border-t border-b border-rule">
      {QUICK_SCORE_VALUES.map((val, i) => {
        const isRem = val === REM_SENTINEL
        const isRemActive = isRem && inputMode === 'remaining'
        return (
          <button
            key={i}
            onClick={() => quickScore(val)}
            className={`py-2 text-center font-mono text-xs select-none cursor-pointer border-none outline-none touch-none transition-colors
              ${isRemActive
                ? 'bg-ink text-bg'
                : 'bg-paper text-ink hover:bg-bg active:bg-ink-faint'
              }`}
          >
            <span className={`hidden md:block text-2xs leading-none mb-0.5 ${isRemActive ? 'text-bg/60' : 'text-ink-light'}`}>
              {FKEY_LABELS[i]}
            </span>
            {QUICK_SCORE_LABELS[i]}
          </button>
        )
      })}
    </div>
  )
}
