'use client'
import { useKeyboard } from '@/hooks/use-keyboard'
import { GameHeader } from './GameHeader'
import { Scoreboard } from './Scoreboard'
import { CheckoutHint } from './CheckoutHint'
import { InputArea } from './InputArea'
import { QuickScores } from './QuickScores'
import { Numpad } from './Numpad'
import { GameLog } from './GameLog'
import { LegOverlay } from './LegOverlay'

export function GameScreen() {
  useKeyboard()

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <GameHeader />

      {/* Scoreboard: full width on all sizes */}
      <Scoreboard />

      {/* Below scoreboard: input left, log right on desktop */}
      <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden">

        {/* ── Input panel ── */}
        <div className="flex flex-col md:w-[400px] md:flex-shrink-0 md:border-r md:border-rule md:overflow-y-auto">
          <CheckoutHint />
          <InputArea />
          <QuickScores />

          {/* Numpad: mobile only */}
          <Numpad />

          {/* Game log: mobile only */}
          <div className="md:hidden flex flex-col" style={{ minHeight: '12rem' }}>
            <GameLog />
          </div>
        </div>

        {/* ── Game log: desktop only ── */}
        <div className="hidden md:flex flex-col flex-1 overflow-hidden">
          <GameLog />
        </div>

      </div>

      <LegOverlay />
    </div>
  )
}
