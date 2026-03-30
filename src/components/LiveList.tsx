'use client'
import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/game-store'
import { validateInput } from '@/lib/engine'
import type { RoundEntry } from '@/types/game'

function CompletedCell({ entry, right }: { entry: RoundEntry | null; right?: boolean }) {
  if (!entry) return (
    <span className={`flex gap-3 ${right ? 'justify-end' : ''}`}>
      <span className="text-ink-faint w-10 text-right">—</span>
    </span>
  )
  return (
    <span className={`flex gap-3 items-baseline ${right ? 'flex-row-reverse' : ''}`}>
      <span className="text-ink font-semibold w-10 text-right">{entry.score}</span>
      <span className="text-ink-light w-10 text-right">{entry.remain}</span>
      {entry.bust && <span className="text-bust text-xs">B</span>}
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
  const training = useGameStore(s => s.config.training)
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
        <span className={`flex gap-3 items-baseline ${right ? 'flex-row-reverse' : ''}`}>
          <span className={`font-mono font-bold text-2xl md:text-3xl w-10 text-right ${isInvalid ? 'text-bust' : 'text-ink'}`}>
            {inputStr}
          </span>
          {hint && <span className="text-ink-light text-base">{hint}</span>}
        </span>
      )
    }

    return (
      <span className={`flex ${right ? 'justify-end' : ''}`}>
        <span className="text-ink-faint w-10 text-right">—</span>
      </span>
    )
  }

  const liveRound = rounds.length + 1
  const cols = training ? 'grid-cols-[2.5rem_1fr]' : 'grid-cols-[2.5rem_1fr_1fr]'

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-5 py-3">

        {/* Completed rounds */}
        {rounds.map((round, i) => (
          <div key={i} className={`grid ${cols} gap-2 text-base md:text-lg border-b border-rule/30 py-2 items-center font-mono`}>
            <span className="text-ink-faint text-sm md:text-base text-right">{(i + 1) * 3}</span>
            <span><CompletedCell entry={round.p0} /></span>
            {!training && <span className="flex justify-end"><CompletedCell entry={round.p1} right /></span>}
          </div>
        ))}

        {/* Live input row */}
        <div className={`grid ${cols} gap-2 py-3 items-center font-mono mt-3`}>
          <span className="text-ink-faint text-sm md:text-base text-right">{liveRound * 3}</span>
          <span>{renderLiveCell(0)}</span>
          {!training && <span className="flex justify-end">{renderLiveCell(1, true)}</span>}
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
