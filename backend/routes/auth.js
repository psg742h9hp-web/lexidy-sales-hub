// ══════════════════════════════════════════════════════════════
// ROUTE: /api/auth
// ══════════════════════════════════════════════════════════════
//
// V1 auth: shared advisor password (ADVISOR_PASSWORD env) issues
// a 12-hour JWT. Simple by design — the Hub runs inside HubSpot,
// only reachable by logged-in Lexidy staff.
//
// Upgrade path (Stage 2): validate a HubSpot OAuth session token
// here instead of a password. Only this file changes.
//
// ══════════════════════════════════════════════════════════════

import { Router } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const router = Router()

// ponytail: per-IP login attempt counter, resets on restart — swap for
// a shared store (Redis) if the backend ever runs on more than one instance
const attempts = new Map()
const MAX_ATTEMPTS = 10
const WINDOW_MS = 15 * 60 * 1000

function tooManyAttempts(ip) {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now - entry.start > WINDOW_MS) {
    attempts.set(ip, { start: now, count: 1 })
    return false
  }
  entry.count++
  return entry.count > MAX_ATTEMPTS
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a))
  const bufB = Buffer.from(String(b))
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)
}

// POST /api/auth/login   { password, advisorName? }
router.post('/login', (req, res) => {
  const { password, advisorName } = req.body || {}

  if (!process.env.ADVISOR_PASSWORD || !process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Auth not configured on server (.env missing)' })
  }
  if (tooManyAttempts(req.ip)) {
    return res.status(429).json({ error: 'Too many attempts — try again later' })
  }
  if (!password || !safeEqual(password, process.env.ADVISOR_PASSWORD)) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  const token = jwt.sign(
    { role: 'advisor', name: advisorName || 'advisor' },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  )

  res.json({ token, expiresIn: 43200 })
})

export default router
