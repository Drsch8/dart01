'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useGameStore } from '@/store/game-store'
import { useSpeech } from '@/hooks/use-speech'

export function GameHeader() {
  const setScreen = useGameStore(s => s.setScreen)
  const undo = useGameStore(s => s.undo)
  const newGame = useGameStore(s => s.newGame)
  const { supported, muted, toggleMute } = useSpeech()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const hdrBtn = 'border border-rule px-4 py-2 text-sm text-ink-light font-mono hover:border-ink hover:text-ink transition-colors cursor-pointer bg-transparent'

  const voiceBtn = supported ? (
    <button
      onClick={toggleMute}
      title={muted ? 'Unmute voice' : 'Mute voice'}
      className={`border px-4 py-2 text-sm font-mono transition-colors cursor-pointer bg-transparent ${
        muted
          ? 'border-rule text-ink-faint hover:border-ink hover:text-ink'
          : 'border-finish text-finish'
      }`}
    >
      {muted ? '🔇' : '🎙'}
    </button>
  ) : null

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-rule bg-paper sticky top-0 z-20">
      <span className="font-display font-bold text-2xl tracking-tight">Darts</span>

      {/* Desktop: all buttons inline */}
      <div className="hidden md:flex gap-2">
        <Link href="/leaderboard" className={hdrBtn}>Board</Link>
        <button className={hdrBtn} onClick={() => setScreen('stats')}>Stats</button>
        {voiceBtn}
        <button className={hdrBtn} onClick={undo}>Undo</button>
        <button className={hdrBtn} onClick={newGame}>New</button>
      </div>

      {/* Mobile: voice + burger */}
      <div className="flex md:hidden gap-2 items-center" ref={menuRef}>
        {voiceBtn}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className={hdrBtn}
          aria-label="Menu"
        >
          ☰
        </button>

        {menuOpen && (
          <div className="absolute top-full right-0 mt-px bg-paper border border-rule shadow-lg z-30 flex flex-col min-w-36">
            <Link
              href="/leaderboard"
              className="px-5 py-3 text-sm font-mono text-ink-light hover:bg-bg hover:text-ink transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Board
            </Link>
            <button
              className="px-5 py-3 text-sm font-mono text-ink-light hover:bg-bg hover:text-ink transition-colors text-left"
              onClick={() => { setScreen('stats'); setMenuOpen(false) }}
            >
              Stats
            </button>
            <button
              className="px-5 py-3 text-sm font-mono text-ink-light hover:bg-bg hover:text-ink transition-colors text-left border-t border-rule"
              onClick={() => { undo(); setMenuOpen(false) }}
            >
              Undo
            </button>
            <button
              className="px-5 py-3 text-sm font-mono text-ink-light hover:bg-bg hover:text-ink transition-colors text-left"
              onClick={() => { newGame(); setMenuOpen(false) }}
            >
              New game
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
