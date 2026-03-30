'use client'
import { useEffect } from 'react'
import { useGameStore } from '@/store/game-store'

/** Returns which dart numbers are physically possible for this checkout score */
function possibleDarts(checkoutScore: number, outRule: 'double' | 'single'): Set<1 | 2 | 3> {
  const maxD1 = outRule === 'double' ? 50 : 60   // bull (D25=50) or T20=60
  const maxD2 = outRule === 'double' ? 110 : 120  // 60+50 or 60+60
  const possible = new Set<1 | 2 | 3>()
  if (checkoutScore <= maxD1) possible.add(1)
  if (checkoutScore <= maxD2) possible.add(2)
  possible.add(3)
  return possible
}

export function FinishDartPicker() {
  const pendingCheckout = useGameStore(s => s.pendingCheckout)
  const confirmFinishDart = useGameStore(s => s.confirmFinishDart)
  const outRule = useGameStore(s => s.config.outRule)

  const possible = pendingCheckout
    ? possibleDarts(pendingCheckout.checkoutScore, outRule)
    : new Set<1 | 2 | 3>()

  // Auto-confirm if only one dart is possible
  useEffect(() => {
    if (!pendingCheckout) return
    if (possible.size === 1) {
      const only = [...possible][0]
      confirmFinishDart(only)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCheckout?.checkoutScore])

  if (!pendingCheckout) return null
  if (possible.size === 1) return null  // auto-confirming, don't flash the picker

  return (
    <div className="fixed inset-0 bg-ink/85 z-50 flex items-center justify-center">
      <div className="bg-paper border-2 border-ink p-8 text-center max-w-xs w-[90%] flex flex-col gap-6">
        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-ink-light font-mono mb-2">
            Checked out {pendingCheckout.checkoutScore}
          </p>
          <p className="font-display font-black text-3xl">Which dart?</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {([1, 2, 3] as const).map(d => {
            const enabled = possible.has(d)
            return (
              <button
                key={d}
                onClick={() => enabled && confirmFinishDart(d)}
                disabled={!enabled}
                className={`py-5 border-2 font-mono text-2xl transition-colors
                  ${enabled
                    ? 'border-rule hover:border-ink hover:bg-bg active:bg-ink-faint cursor-pointer'
                    : 'border-rule/30 text-ink-faint cursor-not-allowed'
                  }`}
              >
                {d}
              </button>
            )
          })}
        </div>

        <p className="text-xs text-ink-light font-mono">Press 1 · 2 · 3  or  Enter for 3rd</p>
      </div>
    </div>
  )
}
