'use client'
import { create } from 'zustand'
import type { GameConfig, GameState, Screen, PendingCheckout } from '@/types/game'
import {
  createInitialGameState,
  processEnterScore,
  processCheckout,
  appendDigit,
  deleteDigit,
  toggleInputMode,
  resetLeg,
  undoLastTurn,
} from '@/lib/engine'
import { saveMatch } from '@/lib/save-match'
import { REM_SENTINEL, FINISH_SENTINEL } from '@/lib/constants'

interface GameStore extends GameState {
  screen: Screen
  pendingCheckout: PendingCheckout | null

  startGame: (config: GameConfig) => void
  appendDigit: (digit: string) => void
  deleteDigit: () => void
  toggleMode: () => void
  enterScore: () => void
  quickScore: (value: number) => void
  confirmFinishDart: (darts: 1 | 2 | 3) => void
  undo: () => void
  newGame: () => void
  setScreen: (screen: Screen) => void
}

const DEFAULT_CONFIG: GameConfig = {
  p1: 'Player 1',
  p2: 'Player 2',
  startScore: 501,
  outRule: 'double',
  legsToWin: 1,
  setsToWin: 1,
}

const INITIAL_GAME = createInitialGameState(DEFAULT_CONFIG)

export const useGameStore = create<GameStore>((set, get) => ({
  // ── Initial state ──
  screen: 'setup',
  pendingCheckout: null,
  ...INITIAL_GAME,

  // ── Actions ──

  startGame: (config) => {
    set({ screen: 'game', pendingCheckout: null, ...createInitialGameState(config) })
  },

  appendDigit: (digit) => {
    set(s => appendDigit(gs(s), digit))
  },

  deleteDigit: () => {
    set(s => deleteDigit(gs(s)))
  },

  toggleMode: () => {
    set(s => toggleInputMode(gs(s)))
  },

  enterScore: () => {
    const outcome = processEnterScore(gs(get()))
    if (outcome.type === 'invalid') return
    if (outcome.type === 'pending-checkout') {
      set({ pendingCheckout: outcome.pending })
      return
    }
    // type === 'ok'
    set({ ...outcome.state })
  },

  quickScore: (value) => {
    if (value === REM_SENTINEL) {
      const state = gs(get())
      if (!state.inputStr) {
        get().toggleMode()
        return
      }
      const originalMode = state.inputMode
      set(s => ({ ...s, inputMode: 'remaining' as const }))
      get().enterScore()
      set(s => ({ ...s, inputMode: originalMode }))
      return
    }
    if (value === FINISH_SENTINEL) {
      const state = gs(get())
      // Enter remaining score in score mode → remaining becomes 0
      const remaining = state.scores[state.current]
      const originalMode = state.inputMode
      set(s => ({ ...s, inputStr: String(remaining), inputMode: 'score' as const }))
      setTimeout(() => {
        get().enterScore()
        set(s => ({ ...s, inputMode: originalMode }))
      }, 60)
      return
    }
    set(s => ({ ...s, inputStr: String(value) }))
    setTimeout(() => get().enterScore(), 60)
  },

  confirmFinishDart: (darts) => {
    const { pendingCheckout } = get()
    if (!pendingCheckout) return

    const outcome = processCheckout(pendingCheckout, darts)
    set({ pendingCheckout: null })

    const { state, winner, matchWon } = outcome

    if (matchWon) {
      const winnerName = winner === 0 ? state.config.p1 : state.config.p2
      saveMatch({
        config: state.config,
        winner: winnerName,
        sets: state.sets,
        allStats: state.allStats,
      })
      set({ ...state, screen: 'stats' })
    } else {
      // Auto-advance to next leg without any overlay
      set({ ...resetLeg(state) })
    }
  },

  undo: () => {
    // Cancel pending dart picker
    if (get().pendingCheckout) {
      set({ pendingCheckout: null })
      return
    }
    set(s => ({ ...undoLastTurn(gs(s)) }))
  },

  newGame: () => {
    set({ screen: 'setup', pendingCheckout: null })
  },

  setScreen: (screen) => {
    set({ screen })
  },
}))

/** Extract pure GameState slice from store for engine functions */
function gs(s: GameStore): GameState {
  return {
    config: s.config,
    current: s.current,
    scores: s.scores,
    legs: s.legs,
    sets: s.sets,
    dartsThrown: s.dartsThrown,
    totalScored: s.totalScored,
    rounds: s.rounds,
    currentRound: s.currentRound,
    inputStr: s.inputStr,
    inputMode: s.inputMode,
    history: s.history,
    allStats: s.allStats,
  }
}
