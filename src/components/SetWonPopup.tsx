'use client'
import { useGameStore } from '@/store/game-store'

export function SetWonPopup() {
  const pendingSetWon = useGameStore(s => s.pendingSetWon)
  const config = useGameStore(s => s.config)
  const continueToNextSet = useGameStore(s => s.continueToNextSet)

  if (!pendingSetWon) return null

  const { winnerName, sets, setHistory } = pendingSetWon
  const setNumber = sets[0] + sets[1]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/60 backdrop-blur-sm"
      style={{ animation: 'fade-in 0.2s ease both' }}
    >
      <div
        className="bg-paper border-2 border-ink p-6 max-w-xs w-[92%] flex flex-col gap-5"
        style={{ animation: 'winner-bounce-in 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-2xs tracking-[0.15em] uppercase text-ink-faint font-mono">Set {setNumber} complete</p>
          <p className="font-display font-black text-3xl leading-tight break-words">{winnerName}</p>
          <p className="text-ink-light font-mono text-sm">{sets[0]} – {sets[1]}</p>
        </div>

        <div>
          <div className="grid grid-cols-[1.5rem_1fr_3.5rem_3.5rem] gap-x-2 text-2xs tracking-[0.1em] uppercase text-ink-faint font-mono border-b border-rule pb-1 mb-1">
            <span>#</span>
            <span>Winner</span>
            <span className="text-right">{config.p1}</span>
            <span className="text-right">{config.p2}</span>
          </div>
          {setHistory.map((h, i) => (
            <div key={i} className="grid grid-cols-[1.5rem_1fr_3.5rem_3.5rem] gap-x-2 text-xs font-mono border-b border-rule/40 py-0.5 items-center">
              <span className="text-ink-faint">{i + 1}</span>
              <span className="text-ink truncate">{h.winner} <span className="text-ink-faint">({h.checkoutScore})</span></span>
              <span className="text-right text-ink">{h.p1avg}</span>
              <span className="text-right text-ink">{h.p2avg}</span>
            </div>
          ))}
        </div>

        <button
          onClick={continueToNextSet}
          className="w-full py-4 border-2 border-ink bg-ink text-bg active:opacity-80 active:scale-[0.97] font-mono text-sm tracking-widest transition-all duration-100 cursor-pointer"
        >
          Set {setNumber + 1} →
        </button>
      </div>
    </div>
  )
}
