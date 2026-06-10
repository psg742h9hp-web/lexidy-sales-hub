// ══════════════════════════════════════════════════════════════
// LEXIDY SALES HUB — DATABASE
// ══════════════════════════════════════════════════════════════
//
// Postgres connection pool + migration runner.
//
// Connect:   import { pool, query } from './db.js'
// Migrate:   npm run migrate   (applies schema.sql)
//
// Connection is configured via DATABASE_URL in .env:
//   postgres://user:password@host:5432/lexidy_sales_hub
//
// ══════════════════════════════════════════════════════════════

import 'dotenv/config'
import pg from 'pg'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Lexidy servers: enable SSL in production if the DB requires it
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
})

pool.on('error', (err) => {
  console.error('Unexpected Postgres pool error:', err)
})

/**
 * Run a parameterized query.
 *   const { rows } = await query('SELECT * FROM visas WHERE id = $1', [visaId])
 */
export function query(text, params) {
  return pool.query(text, params)
}

/**
 * Run schema.sql against the database.
 * Idempotent — schema.sql uses CREATE TABLE IF NOT EXISTS.
 */
export async function migrate() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const sql = await readFile(path.join(__dirname, 'schema.sql'), 'utf8')
  await pool.query(sql)
  console.log('✅ Migration complete — schema applied')
}

// CLI: `node db.js --migrate`
if (process.argv.includes('--migrate')) {
  migrate()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Migration failed:', err.message)
      process.exit(1)
    })
}
