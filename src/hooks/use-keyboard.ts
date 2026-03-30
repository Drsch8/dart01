'use client'
import { useEffect } from 'react'
import { useGameStore } from '@/store/game-store'
import { QUICK_SCORE_VALUES, FKEY_LABELS } from '@/lib/constants'

export function useKeyboard() {
  const appendDigit = useGameStore(s => s.appendDigit)
  const deleteDigit = useGameStore(s => s.deleteDigit)
  const enterScore = useGameStore(s => s.enterScore)
  const quickScore = useGameStore(s => s.quickScore)
  const undo = useGameStore(s => s.undo)
  const newGame = useGameStore(s => s.newGame)
  const confirmFinishDart = useGameStore(s => s.confirmFinishDart)
  const pendingCheckout = useGameStore(s => s.pendingCheckout)
  const outRule = useGameStore(s => s.config.outRule)

  useEffect(() => {
    function possibleDarts(score: number, rule: 'double' | 'single'): Set<number> {
      const maxD1 = rule === 'double' ? 50 : 60
      const maxD2 = rule === 'double' ? 110 : 120
      const s = new Set<number>()
      if (score <= maxD1) s.add(1)
      if (score <= maxD2) s.add(2)
      s.add(3)
      return s
    }

    function handleKey(e: KeyboardEvent) {
      // Finish dart picker active — only handle dart selection and undo
      if (pendingCheckout) {
        const possible = possibleDarts(pendingCheckout.checkoutScore, outRule)
        if (e.key === '1' && possible.has(1)) { e.preventDefault(); confirmFinishDart(1); return }
        if (e.key === '2' && possible.has(2)) { e.preventDefault(); confirmFinishDart(2); return }
        if (e.key === '3' || e.key === 'Enter') { e.preventDefault(); confirmFinishDart(3); return }
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); return }
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); return }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') { e.preventDefault(); newGame(); return }

      const fIdx = FKEY_LABELS.indexOf(e.key)
      if (fIdx >= 0) {
        e.preventDefault()
        quickScore(QUICK_SCORE_VALUES[fIdx])
        return
      }
      if (e.key >= '0' && e.key <= '9') { appendDigit(e.key); return }
      if (e.key === 'Backspace') { e.preventDefault(); deleteDigit(); return }
      if (e.key === 'Enter') { e.preventDefault(); enterScore(); return }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [pendingCheckout, outRule, appendDigit, deleteDigit, enterScore, quickScore, undo, newGame, confirmFinishDart])
}
