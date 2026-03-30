'use client'
import { useGameStore } from '@/store/game-store'

export function FinishDartPicker() {
  const pendingCheckout = useGameStore(s => s.pendingCheckout)
  const confirmFinishDart = useGameStore(s => s.confirmFinishDart)

  if (!pendingCheckout) return null

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
          {([1, 2, 3] as const).map(d => (
            <button
              key={d}
              onClick={() => confirmFinishDart(d)}
              className="py-5 border-2 border-rule font-mono text-2xl hover:border-ink hover:bg-bg active:bg-ink-faint transition-colors"
            >
              {d}
            </button>
          ))}
        </div>

        <p className="text-xs text-ink-light font-mono">Press 1 · 2 · 3  or  Enter for 3rd</p>
      </div>
    </div>
  )
}
