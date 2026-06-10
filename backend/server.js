// ══════════════════════════════════════════════════════════════
// LEXIDY SALES HUB — BACKEND SERVER
// ══════════════════════════════════════════════════════════════
//
// Entry point. Mounts all routes, handles auth middleware.
//
// Run:        npm start
// Dev mode:   npm run dev   (auto-restarts on file changes)
//
// Routes:
//   POST /api/auth/login                       → issue JWT
//   GET  /api/contacts/:contactId              → HubSpot contact proxy
//   GET  /api/countries                        → all countries + visas
//   GET  /api/visas/:visaId                    → single visa detail
//   POST /api/eligibility-questions/:visaId    → dynamic questions
//   POST /api/sessions/eligibility             → log eligibility result
//   POST /api/sessions/pricing                 → log pricing decision
//   GET  /api/admin/data                       → admin panel load
//   POST /api/admin/save                       → admin panel save
//
// ══════════════════════════════════════════════════════════════

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'

import authRoutes from './routes/auth.js'
import contactRoutes from './routes/contacts.js'
import visaRoutes from './routes/visas.js'
import eligibilityRoutes from './routes/eligibility.js'
import sessionRoutes from './routes/sessions.js'
import adminRoutes from './routes/admin.js'

const app = express()
const PORT = process.env.PORT || 3001

// ── MIDDLEWARE ────────────────────────────────────────────────

app.use(express.json({ limit: '2mb' }))

// CORS: only allow the Sales Hub frontend origin(s)
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    callback(new Error(`Origin ${origin} not allowed by CORS`))
  },
}))

// ── AUTH MIDDLEWARE ───────────────────────────────────────────
// Every /api route except /api/auth/login and /api/health
// requires a valid JWT in the Authorization header.

function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization header' })
  }

  try {
    req.advisor = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// ── ROUTES ────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'lexidy-sales-hub-backend' })
})

app.use('/api/auth', authRoutes)

app.use('/api/contacts', requireAuth, contactRoutes)
app.use('/api/countries', requireAuth, visaRoutes.countries)
app.use('/api/visas', requireAuth, visaRoutes.visas)
app.use('/api/eligibility-questions', requireAuth, eligibilityRoutes)
app.use('/api/sessions', requireAuth, sessionRoutes)
app.use('/api/admin', requireAuth, adminRoutes)

// ── ERROR HANDLING ────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// ── START ─────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ Lexidy Sales Hub backend running on port ${PORT}`)
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET not set — auth will fail. Copy .env.example to .env')
  }
  if (!process.env.HUBSPOT_API_KEY) {
    console.warn('⚠️  HUBSPOT_API_KEY not set — HubSpot routes will return mock data')
  }
})

export { requireAuth }
