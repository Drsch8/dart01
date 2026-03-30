'use client'
import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/game-store'
import { validateInput } from '@/lib/engine'
import type { RoundEntry } from '@/types/game'

function CompletedCell({ entry, right }: { entry: RoundEntry | null; right?: boolean }) {
  if (!entry) return <span className="text-ink-faint">—</span>
  return (
    <span className={`inline-flex gap-2 items-baseline ${right ? 'justify-end' : ''}`}>
      <span className="text-ink font-semibold">{entry.score}</span>
      {entry.bust && <span className="text-bust text-xs">B</span>}
      <span className="text-ink-light">{entry.remain}</span>
    </span>
  )
}

export function LiveList() {
  const rounds = useGameStore(s => s.rounds)
  const currentRound = useGameStore(s => s.currentRound)
  const current = useGameStore(s => s.current)
  const inputStr = useGameStore(s => s.inputStr)
  const inputMode = useGameStore(s => s.inputMode)
  const scores = useGameStore(s => s.scores)
  const outRule = useGameStore(s => s.config.outRule)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [rounds.length, current])

  const validation = validateInput(inputStr, inputMode, scores[current], outRule)
  const isInvalid = inputStr !== '' && !validation.valid

  function renderLiveCell(playerIdx: 0 | 1, right?: boolean) {
    const data = playerIdx === 0 ? currentRound.p0 : currentRound.p1
    if (data) return <CompletedCell entry={data} right={right} />

    if (current === playerIdx) {
      const hint = inputStr && validation.valid
        ? inputMode === 'score'
          ? `→ ${validation.remaining}`
          : `sc ${validation.score}`
        : ''
      return (
        <span className={`inline-flex items-baseline gap-2 ${right ? 'justify-end' : ''}`}>
          <span className={`font-mono font-bold text-2xl ${isInvalid ? 'text-bust' : 'text-ink'}`}>
            {inputStr}<span className="animate-pulse font-light text-ink-light">|</span>
          </span>
          {hint && <span className="text-ink-light text-base">{hint}</span>}
        </span>
      )
    }

    return <span className="text-ink-faint">—</span>
  }

  const liveRound = rounds.length + 1

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-5 py-3">

        {/* Column headers */}
        <div className="grid grid-cols-[3rem_1fr_1fr] gap-4 text-xs tracking-[0.12em] uppercase text-ink-faint border-b border-rule pb-2 font-mono sticky top-0 bg-paper">
          <span>#</span>
          <span />
          <span />
        </div>

        {/* Completed rounds */}
        {rounds.map((round, i) => (
          <div key={i} className="grid grid-cols-[3rem_1fr_1fr] gap-4 text-base border-b border-rule/30 py-2 items-center font-mono">
            <span className="text-ink-faint text-sm">{i + 1}</span>
            <span><CompletedCell entry={round.p0} /></span>
            <span className="flex justify-end"><CompletedCell entry={round.p1} right /></span>
          </div>
        ))}

        {/* Live input row */}
        <div className="grid grid-cols-[3rem_1fr_1fr] gap-4 py-3 items-center font-mono border-t-2 border-ink mt-1">
          <span className="text-ink-faint text-sm">{liveRound}</span>
          <span>{renderLiveCell(0)}</span>
          <span className="flex justify-end">{renderLiveCell(1, true)}</span>
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
