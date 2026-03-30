'use client'
import { useGameStore } from '@/store/game-store'
import { getScoreTag } from '@/lib/checkouts'
import { computeAvg, computeFirst9Avg, computeCheckoutPct } from '@/lib/engine'

function PlayerBoard({ idx }: { idx: 0 | 1 }) {
  const score = useGameStore(s => s.scores[idx])
  const legs = useGameStore(s => s.legs[idx])
  const sets = useGameStore(s => s.sets[idx])
  const current = useGameStore(s => s.current)
  const allStats = useGameStore(s => s.allStats)
  const config = useGameStore(s => s.config)
  const setsToWin = useGameStore(s => s.config.setsToWin)

  const name = idx === 0 ? config.p1 : config.p2
  const isCurrent = current === idx
  const tag = getScoreTag(score)
  const stats = allStats[name]

  const avg = stats ? computeAvg(stats) : '—'
  const f9 = stats ? computeFirst9Avg(stats) : '—'
  const coPct = stats ? computeCheckoutPct(stats) : '—'
  const ton80 = stats?.ton80 ?? 0
  const ton40 = stats?.ton40 ?? 0
  const tons = stats?.tons ?? 0

  const legsText = setsToWin > 1 ? `sets ${sets}  legs ${legs}` : `legs ${legs}`

  const scoreColor = isCurrent
    ? (tag === 'finish' ? 'text-finish' : tag === 'bogey' ? 'text-bogey' : tag === 'caution' ? 'text-caution' : 'text-ink')
    : 'text-ink-faint'

  const tagColor =
    tag === 'finish' ? 'text-finish' :
    tag === 'bogey' ? 'text-bogey' :
    tag === 'caution' ? 'text-caution' :
    ''

  return (
    <div className={`relative flex flex-col p-4 md:p-6 transition-colors
      ${idx === 0 ? 'border-r border-rule' : ''}
      ${isCurrent
        ? 'bg-paper shadow-[inset_0_0_0_2px_#1a1a18] z-10'
        : 'bg-bg'
      }`}
    >
      {/* Name */}
      <div className={`text-sm font-mono uppercase tracking-wide mb-2 truncate
        ${isCurrent ? 'text-ink' : 'text-ink-faint'}`}>
        {name}
      </div>

      {/* Score */}
      <div className={`font-display font-black leading-none tracking-tight transition-colors
        ${isCurrent
          ? 'text-[clamp(4rem,11vw,6rem)]'
          : 'text-[clamp(2.5rem,7vw,4rem)]'
        }
        ${scoreColor}`}>
        {score}
      </div>

      {/* Tag */}
      <div className={`text-xs tracking-[0.1em] uppercase h-4 mt-1
        ${isCurrent ? tagColor : 'opacity-0'}`}>
        {tag === 'finish' ? 'Finish' : tag === 'bogey' ? 'Bogey' : ''}
      </div>

      {/* Stats — pinned to bottom, no animation */}
      <div className={`mt-auto pt-2 ${isCurrent ? '' : 'opacity-25'}`}>
        {/* Mobile: compact */}
        <div className="flex gap-4 text-sm text-ink-light md:hidden font-mono">
          <span>avg {avg}</span>
          <span>{legsText}</span>
        </div>

        {/* Desktop: full grid */}
        <div className="hidden md:grid grid-cols-3 gap-x-4 gap-y-1 text-sm text-ink-light font-mono">
          <span>avg {avg}</span>
          <span>f9 {f9}</span>
          <span>co {coPct}</span>
          <span>180 {ton80}</span>
          <span>140+ {ton40}</span>
          <span>100+ {tons}</span>
          <span className="col-span-3">{legsText}</span>
        </div>
      </div>
    </div>
  )
}

export function Scoreboard() {
  const training = useGameStore(s => s.config.training)
  return (
    <div className="shrink-0 border-b border-rule">
      <div className={`grid ${training ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <PlayerBoard idx={0} />
        {!training && <PlayerBoard idx={1} />}
      </div>
    </div>
  )
}
