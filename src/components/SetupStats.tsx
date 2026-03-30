'use client'
import { useState, useEffect } from 'react'
import type { PlayerStat } from '@/app/api/players/route'

export function SetupStats() {
  const [players, setPlayers] = useState<PlayerStat[] | null>(null)

  useEffect(() => {
    fetch('/api/players')
      .then(r => r.json())
      .then(d => setPlayers(d.players))
      .catch(() => setPlayers([]))
  }, [])

  if (players === null) return (
    <div className="bg-paper border border-rule p-6 animate-pulse">
      <div className="text-2xs tracking-[0.12em] uppercase text-ink-light mb-4">Career Stats</div>
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-4 bg-rule rounded" style={{ width: `${70 - i * 8}%` }} />
        ))}
      </div>
    </div>
  )

  if (players.length === 0) return null

  return (
    <div className="bg-paper border border-rule p-6">
      <div className="text-2xs tracking-[0.12em] uppercase text-ink-light mb-4">Career Stats</div>
      <table className="w-full font-mono text-xs">
        <thead>
          <tr className="text-ink-faint border-b border-rule">
            <th className="text-left pb-2 font-normal">Player</th>
            <th className="text-right pb-2 font-normal">M</th>
            <th className="text-right pb-2 font-normal">W</th>
            <th className="text-right pb-2 font-normal">Avg</th>
            <th className="text-right pb-2 font-normal">Co%</th>
            <th className="text-right pb-2 font-normal">180s</th>
          </tr>
        </thead>
        <tbody>
          {players.map(p => (
            <tr key={p.name} className="border-b border-rule/40">
              <td className="py-1.5 text-ink">{p.name}</td>
              <td className="py-1.5 text-right text-ink-light">{p.matches}</td>
              <td className="py-1.5 text-right text-ink-light">{p.wins}</td>
              <td className="py-1.5 text-right text-ink-light">{p.avg_score ?? '—'}</td>
              <td className="py-1.5 text-right text-ink-light">{p.co_pct != null ? `${p.co_pct}%` : '—'}</td>
              <td className="py-1.5 text-right text-ink-light">{p.total_180s}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
