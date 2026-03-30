#!/usr/bin/env node
/**
 * Seed a handful of test matches via the local /api/save-match endpoint.
 * Usage: node scripts/seed-matches.js
 */

const BASE = 'http://localhost:3000'

const PLAYERS = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve']

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeStats(won, legs) {
  const darts = legs * rand(15, 30)
  const scored = legs * rand(300, 450)
  const first9darts = legs * 9
  const first9scored = legs * rand(180, 320)
  const checkouts = won ? legs : rand(0, legs)
  const attempts = checkouts + rand(0, 3)
  return {
    legs,
    darts,
    scored,
    checkouts,
    attempts,
    tons: rand(0, legs * 2),
    ton40: rand(0, legs),
    ton80: rand(0, 2),
    first9scored,
    first9darts,
  }
}

const MATCHES = [
  { p1: 'Alice', p2: 'Bob',   winner: 'Alice', legsToWin: 3 },
  { p1: 'Bob',   p2: 'Carol', winner: 'Bob',   legsToWin: 3 },
  { p1: 'Carol', p2: 'Dave',  winner: 'Dave',  legsToWin: 1 },
  { p1: 'Alice', p2: 'Carol', winner: 'Carol', legsToWin: 3 },
  { p1: 'Dave',  p2: 'Eve',   winner: 'Eve',   legsToWin: 1 },
  { p1: 'Eve',   p2: 'Alice', winner: 'Alice', legsToWin: 3 },
  { p1: 'Bob',   p2: 'Dave',  winner: 'Dave',  legsToWin: 3 },
  { p1: 'Carol', p2: 'Eve',   winner: 'Carol', legsToWin: 1 },
  { p1: 'Alice', p2: 'Dave',  winner: 'Alice', legsToWin: 3 },
  { p1: 'Bob',   p2: 'Eve',   winner: 'Bob',   legsToWin: 3 },
]

async function sendMatch({ p1, p2, winner, legsToWin }) {
  const p1Legs = winner === p1 ? legsToWin : rand(0, legsToWin - 1)
  const p2Legs = winner === p2 ? legsToWin : rand(0, legsToWin - 1)

  const payload = {
    config: { p1, p2, startScore: 501, outRule: 'double', legsToWin, setsToWin: 1 },
    winner,
    sets: [0, 0],
    allStats: {
      [p1]: makeStats(winner === p1, Math.max(p1Legs, 1)),
      [p2]: makeStats(winner === p2, Math.max(p2Legs, 1)),
    },
  }

  const res = await fetch(`${BASE}/api/save-match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json = await res.json()
  const status = json.ok ? '✓' : `✗ ${json.reason}`
  console.log(`  ${p1} vs ${p2} → ${winner} wins  ${status}`)
}

async function main() {
  console.log(`Seeding ${MATCHES.length} matches against ${BASE}...\n`)
  for (const m of MATCHES) {
    await sendMatch(m)
  }
  console.log('\nDone. Check /leaderboard to see stats.')
}

main().catch(err => { console.error(err); process.exit(1) })
