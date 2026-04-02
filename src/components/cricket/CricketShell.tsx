'use client'
import { useCricketStore } from '@/store/cricket-store'
import { CricketSetup } from './CricketSetup'
import { CricketGame } from './CricketGame'

export function CricketShell() {
  const screen = useCricketStore(s => s.screen)
  return screen === 'game' ? <CricketGame /> : <CricketSetup />
}
