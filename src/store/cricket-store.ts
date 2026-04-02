'use client'
import { create } from 'zustand'
import type { CricketConfig, CricketSnapshot } from '@/types/cricket'

interface CricketStore extends CricketSnapshot {
  screen: 'setup' | 'game'
  config: CricketConfig
  history: CricketSnapshot[]

  startGame: (config: CricketConfig) => void
  addMark: (num: number) => void
  endTurn: () => void
  undo: () => void
  newGame: () => void
}

function initMarks(numbers: number[]): Record<number, [number, number]> {
  return Object.fromEntries(numbers.map(n => [n, [0, 0]]))
}

function checkWinner(
  numbers: number[],
  marks: Record<number, [number, number]>,
  scores: [number, number],
): 0 | 1 | null {
  for (const p of [0, 1] as const) {
    const allClosed = numbers.every(n => marks[n][p] >= 3)
    if (allClosed && scores[p] >= scores[p === 0 ? 1 : 0]) return p
  }
  return null
}

function snap(s: CricketStore): CricketSnapshot {
  return { marks: s.marks, scores: s.scores, current: s.current, dartsThisRound: s.dartsThisRound, winner: s.winner }
}

const BLANK: CricketSnapshot = {
  marks: {}, scores: [0, 0], current: 0, dartsThisRound: 0, winner: null,
}

export const useCricketStore = create<CricketStore>((set, get) => ({
  screen: 'setup',
  config: { p1: '', p2: '', numbers: [20, 19, 18, 17, 16, 15, 25] },
  history: [],
  ...BLANK,

  startGame: (config) => {
    set({
      screen: 'game',
      config,
      history: [],
      marks: initMarks(config.numbers),
      scores: [0, 0],
      current: 0,
      dartsThisRound: 0,
      winner: null,
    })
  },

  addMark: (num) => {
    const s = get()
    if (s.winner !== null || s.dartsThisRound >= 3) return
    const opp: 0 | 1 = s.current === 0 ? 1 : 0

    const cur = s.marks[num][s.current]
    const opp_ = s.marks[num][opp]

    const newPair: [number, number] = s.current === 0
      ? [cur + 1, s.marks[num][1]]
      : [s.marks[num][0], cur + 1]
    const newMarks = { ...s.marks, [num]: newPair }

    const newScores: [number, number] = [s.scores[0], s.scores[1]]
    // Score when already closed (≥3) and opponent not closed
    if (cur >= 3 && opp_ < 3) {
      newScores[s.current] += num === 25 ? 25 : num
    }

    const newDarts = s.dartsThisRound + 1
    const winner = checkWinner(s.config.numbers, newMarks, newScores)

    set({
      marks: newMarks,
      scores: newScores,
      dartsThisRound: newDarts,
      winner,
      history: [...s.history, snap(s)],
    })
  },

  endTurn: () => {
    const s = get()
    if (s.winner !== null) return
    const next: 0 | 1 = s.current === 0 ? 1 : 0
    set({ current: next, dartsThisRound: 0, history: [...s.history, snap(s)] })
  },

  undo: () => {
    const { history } = get()
    if (history.length === 0) return
    const prev = history[history.length - 1]
    set({ ...prev, history: history.slice(0, -1) })
  },

  newGame: () => {
    set({ screen: 'setup', history: [], ...BLANK })
  },
}))
