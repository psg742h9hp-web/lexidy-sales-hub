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

const router = Router()

// POST /api/auth/login   { password, advisorName? }
router.post('/login', (req, res) => {
  const { password, advisorName } = req.body || {}

  if (!process.env.ADVISOR_PASSWORD || !process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Auth not configured on server (.env missing)' })
  }
  if (!password || password !== process.env.ADVISOR_PASSWORD) {
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
