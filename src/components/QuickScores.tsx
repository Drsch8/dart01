'use client'
import { useGameStore } from '@/store/game-store'
import { QUICK_SCORE_VALUES, QUICK_SCORE_LABELS, FKEY_LABELS, REM_SENTINEL, FINISH_SENTINEL } from '@/lib/constants'
import { isFinishable } from '@/lib/checkouts'

export function QuickScores() {
  const quickScore = useGameStore(s => s.quickScore)
  const current = useGameStore(s => s.current)
  const currentScore = useGameStore(s => s.scores[current])

  const canFinish = isFinishable(currentScore)

  return (
    <div className="shrink-0 border-t border-rule-strong pt-1">
      <div className="grid grid-cols-6 md:grid-cols-12 gap-0.5 bg-bg px-0.5 pb-0.5">
        {QUICK_SCORE_VALUES.map((val, i) => {
          const isFinish = val === FINISH_SENTINEL
          const isRem = val === REM_SENTINEL
          const isWord = isFinish || isRem

          let cls = 'bg-key text-ink active:bg-rule-strong'
          if (isFinish && canFinish) cls = 'bg-finish text-bg active:opacity-80'
          else if (isFinish) cls = 'bg-panel text-ink-faint'
          else if (isRem) cls = 'bg-panel text-ink-light active:bg-rule-strong'

          return (
            <button
              key={i}
              onClick={() => quickScore(val)}
              onTouchEnd={e => (e.currentTarget as HTMLElement).blur()}
              className={`py-3 text-center select-none cursor-pointer border-none outline-none touch-none
                transition-[background-color,transform] active:scale-[0.97] duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink
                ${isWord
                  ? 'font-cond text-[15px] font-bold tracking-caps uppercase'
                  : 'font-num text-2xl md:text-xl leading-none'}
                ${cls}`}
            >
              <span className="hidden md:block font-cond text-[10px] font-medium leading-none mb-1 text-ink-faint">
                {FKEY_LABELS[i]}
              </span>
              {QUICK_SCORE_LABELS[i]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
