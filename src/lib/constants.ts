import type { StartScore } from '@/types/game'

export const START_SCORES: StartScore[] = [301, 501, 701]

export const LEGS_OPTIONS = [1, 3, 5, 7]
export const SETS_OPTIONS = [1, 3, 5, 7]

/** Sentinel: triggers "enter as remaining" */
export const REM_SENTINEL = -1
/** Sentinel: enters the player's full remaining score (checkout) */
export const FINISH_SENTINEL = -2

// F1=Miss  F2–F11=scores  F11=→rem  F12=Finish
export const QUICK_SCORE_VALUES = [0, 26, 41, 45, 60, 81, 85, 100, 121, 140, REM_SENTINEL, FINISH_SENTINEL]
export const QUICK_SCORE_LABELS = ['0', '26', '41', '45', '60', '81', '85', '100', '121', '140', 'rest', 'Finish']
export const FKEY_LABELS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12']
