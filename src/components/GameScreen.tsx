'use client'
import { useState } from 'react'
import { useKeyboard } from '@/hooks/use-keyboard'
import { useGameStore } from '@/store/game-store'
import { validateInput } from '@/lib/engine'
import { GameHeader } from './GameHeader'
import { Scoreboard } from './Scoreboard'
import { CheckoutHint } from './CheckoutHint'
import { LiveList } from './LiveList'
import { QuickScores } from './QuickScores'
import { Numpad } from './Numpad'
import { FinishDartPicker } from './FinishDartPicker'

/** Mobile-only: compact display of what's currently being typed */
function MobileInputDisplay({ onShowScores }: { onShowScores: () => void }) {
  const inputStr = useGameStore(s => s.inputStr)
  const inputMode = useGameStore(s => s.inputMode)
  const current = useGameStore(s => s.current)
  const scores = useGameStore(s => s.scores)
  const outRule = useGameStore(s => s.config.outRule)
  const currentRound = useGameStore(s => s.currentRound)
  const rounds = useGameStore(s => s.rounds)
  const training = useGameStore(s => s.config.training)

  const validation = validateInput(inputStr, inputMode, scores[current], outRule)
  const isInvalid = inputStr !== '' && !validation.valid

  const hint = inputStr && validation.valid
    ? inputMode === 'score'
      ? `→ ${validation.remaining}`
      : `sc ${validation.score}`
    : ''

  // Last entered score
  const lastScore = training
    ? rounds[rounds.length - 1]?.p0?.score
    : current === 1
      ? currentRound.p0?.score
      : rounds[rounds.length - 1]?.p1?.score

  return (
    <div className="px-5 py-2 border-b border-rule bg-paper flex items-center gap-3">
      <span className={`font-mono font-bold text-3xl flex-1 ${isInvalid ? 'text-bust' : 'text-ink'}`}>
        {inputStr}
        {hint && (
          <span className="text-ink-light text-lg font-mono ml-3">{hint}</span>
        )}
      </span>
      {lastScore !== undefined && (
        <span className="font-mono text-xl text-ink-faint shrink-0">{lastScore}</span>
      )}
      <button
        onClick={onShowScores}
        className="shrink-0 border border-rule px-3 py-1.5 text-xs font-mono text-ink-light hover:border-ink hover:text-ink transition-colors"
      >
        Scores
      </button>
    </div>
  )
}

export function GameScreen() {
  useKeyboard()
  const [showScores, setShowScores] = useState(false)
  const rounds = useGameStore(s => s.rounds)
  const undo = useGameStore(s => s.undo)

  return (
    <div className="h-dvh bg-bg flex flex-col overflow-hidden">
      <GameHeader />

      {/* ── Desktop: centered column with scrollable LiveList ── */}
      <div className="hidden md:flex flex-1 min-h-0 justify-center overflow-hidden">
        <div className="w-full max-w-2xl bg-paper flex flex-col overflow-hidden border-x border-rule">
          <Scoreboard />
          <CheckoutHint />
          <LiveList />
          <QuickScores />
        </div>
      </div>

      {/* ── Mobile: fixed layout, no scrolling ── */}
      <div className="md:hidden flex-1 min-h-0 flex flex-col overflow-hidden bg-paper">
        <Scoreboard />
        <CheckoutHint />
        <MobileInputDisplay onShowScores={() => setShowScores(true)} />
        <QuickScores />
        <Numpad />
      </div>

      {/* ── Mobile scores overlay ── */}
      {showScores && (
        <div className="md:hidden fixed inset-0 z-40 bg-paper flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-rule shrink-0">
            <button
              onClick={() => { undo(); }}
              className="font-mono text-sm text-ink-light hover:text-ink px-2 py-1"
            >
              Undo
            </button>
            <button
              onClick={() => setShowScores(false)}
              className="font-mono text-sm text-ink-light hover:text-ink px-2 py-1"
            >
              ✕ Close
            </button>
          </div>
          <LiveList />
        </div>
      )}

      <FinishDartPicker />
    </div>
  )
}
