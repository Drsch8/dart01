'use client'
import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/game-store'

export function GameLog() {
  const rounds = useGameStore(s => s.rounds)
  const config = useGameStore(s => s.config)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [rounds.length])

  return (
    <div className="flex-1 overflow-y-auto bg-bg">
      <div className="px-3 py-2">
        {/* Header */}
        <div className="grid grid-cols-[2.5rem_1fr_1fr] gap-2 text-[10px] tracking-[0.1em] uppercase text-ink-faint border-b border-rule pb-1.5 mb-0.5 font-mono">
          <span>#</span>
          <span>{config.p1}</span>
          <span className="text-right">{config.p2}</span>
        </div>

        {/* Rows */}
        {rounds.map((round, i) => {
          const p0 = round.p0
          const p1 = round.p1
          return (
            <div key={i} className="grid grid-cols-[2.5rem_1fr_1fr] gap-2 text-[11px] border-b border-rule/40 py-0.5 items-center font-mono">
              <span className="text-ink-faint">{i + 1}</span>
              <span>
                {p0 ? (
                  <>
                    <span className="text-ink">{p0.score}</span>
                    {p0.bust && <span className="text-bust ml-0.5 text-[10px]">B</span>}
                    <span className="text-ink-faint ml-1">{p0.remain}</span>
                  </>
                ) : <span className="text-ink-faint">—</span>}
              </span>
              <span className="text-right">
                {p1 ? (
                  <>
                    <span className="text-ink">{p1.score}</span>
                    {p1.bust && <span className="text-bust ml-0.5 text-[10px]">B</span>}
                    <span className="text-ink-faint ml-1">{p1.remain}</span>
                  </>
                ) : <span className="text-ink-faint">—</span>}
              </span>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
