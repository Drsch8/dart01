'use client'
import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/game-store'
import { getScoreTag, getCheckoutSuggestions, isFinishable } from '@/lib/checkouts'
import { computeAvg, validateInput } from '@/lib/engine'
import type { RoundEntry } from '@/types/game'

/** The em offset matches the space below Anton’s digits, aligning the box to the visible score. */
function FinishSuggestion({ score }: { score: number }) {
  const route = isFinishable(score) ? getCheckoutSuggestions(score, 1)[0] : null
  if (!route) return null

  return (
    <div className="shrink-0 mb-[0.085em] rounded border border-[#245f43] bg-finish-bg text-finish px-2.5 py-1.5">
      <div className="font-cond text-xl md:text-2xl font-semibold leading-tight whitespace-nowrap">{route}</div>
    </div>
  )
}

/**
 * This player's leg, read as one line between the main scores: each round's
 * points, oldest to newest, newest kept in view.
 * The thrower's in-progress entry is the last tile.
 */
function RoundStrip({ idx, isCurrent }: { idx: 0 | 1; isCurrent: boolean }) {
  const rounds = useGameStore(s => s.rounds)
  const currentRound = useGameStore(s => s.currentRound)
  const inputStr = useGameStore(s => s.inputStr)
  const inputMode = useGameStore(s => s.inputMode)
  const score = useGameStore(s => s.scores[idx])
  const outRule = useGameStore(s => s.config.outRule)
  const scrollRef = useRef<HTMLDivElement>(null)

  const key = idx === 0 ? 'p0' : 'p1'

  // Taking this player's own entries sidesteps the paired-round bookkeeping
  // entirely: a leg that player 2 started simply has no p0 entry to skip.
  const entries: RoundEntry[] = [...rounds.map(r => r[key]), currentRound[key]]
    .filter((e): e is RoundEntry => e != null)

  const validation = validateInput(inputStr, inputMode, score, outRule)
  const isInvalid = inputStr !== '' && !validation.valid
  const showLive = isCurrent && currentRound[key] == null

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [entries.length, inputStr, isCurrent])

  const tile = 'shrink-0 min-w-[3.25rem] rounded px-2 py-1 bg-key text-center'

  return (
    <div
      ref={scrollRef}
      className="h-[34px] shrink-0 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* Both players' throws start at the left edge, oldest to newest. */}
      <div className="flex gap-1.5 w-max min-w-full text-left">
        {entries.map((e, i) => (
          <div key={i} className={tile}>
            <div className={`font-num text-2xl leading-none ${e.bust ? 'text-bust' : e.score >= 100 ? 'text-accent' : 'text-ink'}`}>{e.score}</div>
          </div>
        ))}

        {showLive && (
          <div className={`${tile} bg-transparent`}>
            <div
              className={`font-num text-2xl leading-none border-b-2 min-w-[2rem] inline-block
                ${isInvalid ? 'text-bust border-bust' : 'text-ink border-accent'}`}
            >
              {inputStr || ' '}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Equal player panels with both throw histories facing the center. */
function PlayerRow({ idx, isCurrent, isStarter, right }: { idx: 0 | 1; isCurrent: boolean; isStarter: boolean; right: boolean }) {
  const score = useGameStore(s => s.scores[idx])
  const legs = useGameStore(s => s.legs[idx])
  const sets = useGameStore(s => s.sets[idx])
  const darts = useGameStore(s => s.dartsThrown[idx])
  const config = useGameStore(s => s.config)
  const allStats = useGameStore(s => s.allStats)
  const setsToWin = config.setsToWin

  const name = idx === 0 ? config.p1 : config.p2
  const stats = allStats[name]
  const avg = stats ? computeAvg(stats) : '—'
  const tag = getScoreTag(score)

  // The active score uses this player’s red or blue accent.
  const scoreColor = isCurrent ? 'text-accent' : tag === 'bogey' ? 'text-bogey' : 'text-ink'

  return (
    <div
      className={`bg-paper min-h-0 flex flex-col justify-between px-[21px] py-2 [container-type:size] ${idx === 1 ? 'shadow-[inset_0_1px_0_var(--rule-strong)] [--accent:var(--p2)]' : '[--accent:var(--p1)]'}`}
      aria-label={`${name}${isCurrent ? ', active player' : ''}`}
    >
      {idx === 1 && <RoundStrip idx={idx} isCurrent={isCurrent} />}

      <div className={`flex items-baseline justify-between gap-3 ${right ? 'flex-row-reverse' : ''}`}>
        <div className="font-cond font-semibold text-xl md:text-2xl leading-none tracking-[0.06em] uppercase truncate min-w-0 px-2.5 py-1.5 text-ink">
          {name}{isStarter && <span className="text-ink ml-1.5">*</span>}
        </div>
        <div className="font-cond text-sm md:text-base font-semibold tracking-[0.1em] text-[#a5adbb] shrink-0">
          {setsToWin > 1 && <>SETS {sets} &middot; </>}LEGS {legs}
        </div>
      </div>

      {/* Keep the checkout attached to the numeral, with stats at the far edge. */}
      <div className={`flex flex-wrap items-center justify-between gap-3 min-h-0 ${right ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-end gap-3 min-w-0 text-[clamp(2.5rem,min(50cqw,calc(100cqh-82px)),180px)] ${right ? 'flex-row-reverse text-right' : ''}`}>
          <div
            className={`font-num shrink-0 overflow-clip leading-none transition-colors duration-[350ms] motion-reduce:transition-none tracking-[-0.02em] ${scoreColor}`}
          >
            {score}
          </div>
          <FinishSuggestion score={score} />
        </div>
        <div className={`shrink-0 flex flex-col gap-1.5 font-cond leading-none tabular-nums ${right ? 'text-left' : 'text-right'}`}>
          <div className="flex items-baseline justify-between gap-2"><span className="text-xs tracking-[0.08em] text-[#a5adbb]">AVG</span><span className="text-xl md:text-2xl font-semibold text-ink">{avg}</span></div>
          <div className="flex items-baseline justify-between gap-2"><span className="text-xs tracking-[0.08em] text-[#a5adbb]">DARTS</span><span className="text-xl md:text-2xl font-semibold text-ink">{darts}</span></div>
        </div>
      </div>

      {idx === 0 && <RoundStrip idx={idx} isCurrent={isCurrent} />}
    </div>
  )
}

export function Scoreboard() {
  const training = useGameStore(s => s.config.training)
  const current = useGameStore(s => s.current)
  const rounds = useGameStore(s => s.rounds)
  const currentRound = useGameStore(s => s.currentRound)

  const legStarter: 0 | 1 =
    rounds.length > 0
      ? (rounds[0].p0 === null ? 1 : 0)
      : (currentRound.p1 !== null && currentRound.p0 === null ? 1 : 0)

  // One persistent overlay moves both edge bars together between the equal rows.
  return (
    <div className={`flex-1 min-h-0 overflow-y-auto ${!training && current === 1 ? '[--accent:var(--p2)]' : '[--accent:var(--p1)]'}`}>
      <div className={`relative h-full grid ${training ? 'min-h-[180px] grid-rows-1' : 'min-h-[360px] grid-rows-2'}`}>
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 z-10 border-x-[5px] border-accent pointer-events-none transition-[transform,border-color] duration-[350ms] ease-in-out motion-reduce:transition-none ${training ? 'h-full' : 'h-1/2'}`}
          style={{ transform: `translateY(${!training && current === 1 ? '100%' : '0'})` }}
        />
        {(training ? [0] as const : [0, 1] as const).map(idx => (
          <PlayerRow
            key={idx}
            idx={idx}
            isCurrent={training || current === idx}
            isStarter={!training && legStarter === idx}
            right={idx === 1}
          />
        ))}
      </div>
    </div>
  )
}
