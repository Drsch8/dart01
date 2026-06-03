'use client'
import { create } from 'zustand'
import type { GameConfig, GameState, Screen, PendingCheckout, LegHistory } from '@/types/game'
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

export interface PendingSetWon {
  winnerName: string
  sets: [number, number]
  setHistory: LegHistory[]
}

interface GameStore extends GameState {
  screen: Screen
  pendingCheckout: PendingCheckout | null
  pendingSetWon: PendingSetWon | null
  matchFinished: boolean
  winnerName: string | null
  snapshotBeforeCheckout: GameState | null

  startGame: (config: GameConfig) => void
  appendDigit: (digit: string) => void
  deleteDigit: () => void
  toggleMode: () => void
  enterScore: () => void
  quickScore: (value: number) => void
  confirmFinishDart: (darts: 1 | 2 | 3) => void
  continueToNextSet: () => void
  dismissWinner: () => void
  undoWinner: () => void
  rematch: () => void
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
  pendingSetWon: null,
  matchFinished: false,
  winnerName: null,
  snapshotBeforeCheckout: null,
  ...INITIAL_GAME,

  // ── Actions ──

  startGame: (config) => {
    set({ screen: 'game', pendingCheckout: null, pendingSetWon: null, matchFinished: false, winnerName: null, snapshotBeforeCheckout: null, ...createInitialGameState(config) })
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
    const before = gs(get())
    const outcome = processEnterScore(before)
    if (outcome.type === 'invalid') return
    if (outcome.type === 'pending-checkout') {
      set({ pendingCheckout: outcome.pending, snapshotBeforeCheckout: before })
      return
    }
    set({ ...outcome.state })
  },

  quickScore: (value) => {
    if (value === REM_SENTINEL) {
      const state = gs(get())
      if (!state.inputStr) return
      const outcome = processEnterScore({ ...state, inputMode: 'remaining' })
      if (outcome.type === 'invalid') return
      if (outcome.type === 'pending-checkout') { set({ pendingCheckout: outcome.pending, snapshotBeforeCheckout: state }); return }
      set({ ...outcome.state, inputMode: 'score' })
      return
    }
    if (value === FINISH_SENTINEL) {
      const state = gs(get())
      const remaining = state.scores[state.current]
      const outcome = processEnterScore({ ...state, inputStr: String(remaining), inputMode: 'score' })
      if (outcome.type === 'invalid') return
      if (outcome.type === 'pending-checkout') { set({ pendingCheckout: outcome.pending, snapshotBeforeCheckout: state }); return }
      set({ ...outcome.state })
      return
    }
    const state = gs(get())
    const outcome = processEnterScore({ ...state, inputStr: String(value), inputMode: 'score' })
    if (outcome.type === 'invalid') return
    if (outcome.type === 'pending-checkout') { set({ pendingCheckout: outcome.pending, snapshotBeforeCheckout: state }); return }
    set({ ...outcome.state })
  },

  confirmFinishDart: (darts) => {
    const { pendingCheckout } = get()
    if (!pendingCheckout) return

    const outcome = processCheckout(pendingCheckout, darts)
    set({ pendingCheckout: null })

    const { state, winner, setWon, matchWon } = outcome

    if (matchWon) {
      const winnerName = winner === 0 ? state.config.p1 : state.config.p2
      if (!state.config.training) {
        saveMatch({
          config: state.config,
          winner: winnerName,
          sets: state.sets,
          allStats: state.allStats,
        })
      }
      set({ ...state, matchFinished: true, winnerName: state.config.training ? null : winnerName, screen: state.config.training ? 'stats' : 'game' })
    } else if (setWon && state.config.setsToWin > 1) {
      const winnerName = winner === 0 ? state.config.p1 : state.config.p2
      const newSets = state.sets
      const prevSets: [number, number] = [newSets[0], newSets[1]]
      prevSets[winner]--
      const setHistory = state.history.filter(h =>
        (h.setsAfter[0] === prevSets[0] && h.setsAfter[1] === prevSets[1]) ||
        (h.setsAfter[0] === newSets[0] && h.setsAfter[1] === newSets[1])
      )
      set({ ...state, pendingSetWon: { winnerName, sets: newSets, setHistory } })
    } else {
      set({ ...resetLeg(state) })
    }
  },

  continueToNextSet: () => {
    set(s => ({ ...resetLeg(gs(s)), pendingSetWon: null }))
  },

  dismissWinner: () => {
    set({ winnerName: null, screen: 'stats' })
  },

  undoWinner: () => {
    const snap = get().snapshotBeforeCheckout
    if (snap) {
      set({ ...snap, winnerName: null, matchFinished: false, pendingCheckout: null, snapshotBeforeCheckout: null, screen: 'game' })
    }
  },

  rematch: () => {
    const config = get().config
    set({ screen: 'game', pendingCheckout: null, pendingSetWon: null, matchFinished: false, winnerName: null, snapshotBeforeCheckout: null, ...createInitialGameState(config) })
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
