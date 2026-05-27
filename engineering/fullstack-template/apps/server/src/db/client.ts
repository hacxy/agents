import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { join } from 'path'
import * as schema from './schema'

const sqlite = new Database(
  process.env.DATABASE_URL ?? join(import.meta.dir, '../../../dev.db'),
  { create: true }
)

export const db = drizzle(sqlite, { schema })

const migrationsFolder = join(import.meta.dir, 'migrations')
try {
  migrate(db, { migrationsFolder })
} catch (err) {
  console.error('[db] Migration failed:', err)
  process.exit(1)
}
