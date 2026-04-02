'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCricketStore } from '@/store/cricket-store'
import { CRICKET_ALL_NUMBERS } from '@/types/cricket'

export function CricketSetup() {
  const startGame = useCricketStore(s => s.startGame)
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [numbers, setNumbers] = useState<number[]>([20, 19, 18, 17, 16, 15, 25])

  function toggleNumber(n: number) {
    setNumbers(prev =>
      prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]
    )
  }

  function handleStart() {
    if (numbers.length === 0) return
    const sorted = [...numbers].sort((a, b) => {
      if (a === 25) return 1
      if (b === 25) return -1
      return b - a
    })
    startGame({ p1: p1.trim() || 'Player 1', p2: p2.trim() || 'Player 2', numbers: sorted })
  }

  const input = 'w-full border border-rule bg-bg px-3 py-2 font-mono text-sm text-ink outline-none focus:border-ink'
  const fieldLabel = 'block text-2xs tracking-[0.12em] uppercase text-ink-light mb-2'

  return (
    <div className="min-h-screen bg-bg p-4 md:p-12">
      <div className="flex items-end justify-between mb-4 md:mb-12">
        <div className="flex items-end gap-5">
          <Link
            href="/"
            className="font-display font-black text-[clamp(3rem,8vw,5rem)] leading-[0.9] tracking-tight text-ink-faint hover:text-ink transition-colors"
          >
            Darts
          </Link>
          <h1 className="font-display font-black text-[clamp(3rem,8vw,5rem)] leading-[0.9] tracking-tight">
            Cricket
          </h1>
        </div>
      </div>

      <div className="bg-paper border border-rule w-full md:w-[380px] p-4 md:p-8 flex flex-col gap-3 md:gap-6">
        <div>
          <label className={fieldLabel}>Player 1</label>
          <input
            className={input}
            value={p1}
            onChange={e => setP1(e.target.value)}
            placeholder="Player 1"
          />
        </div>

        <div>
          <label className={fieldLabel}>Player 2</label>
          <input
            className={input}
            value={p2}
            onChange={e => setP2(e.target.value)}
            placeholder="Player 2"
            onKeyDown={e => e.key === 'Enter' && handleStart()}
          />
        </div>

        <div>
          <label className={fieldLabel}>Numbers in play</label>
          <div className="flex flex-wrap gap-2">
            {CRICKET_ALL_NUMBERS.map(n => {
              const active = numbers.includes(n)
              return (
                <button
                  key={n}
                  onClick={() => toggleNumber(n)}
                  className={`px-4 py-2 font-mono text-sm border transition-colors cursor-pointer
                    ${active
                      ? 'border-ink bg-ink text-bg'
                      : 'border-rule bg-bg text-ink-light hover:border-ink hover:text-ink'
                    }`}
                >
                  {n === 25 ? 'Bull' : n}
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={numbers.length === 0}
          className="bg-ink text-bg py-3 font-mono text-sm tracking-[0.06em] hover:opacity-80 transition-opacity w-full disabled:opacity-30"
        >
          Start Game
        </button>
      </div>
    </div>
  )
}
