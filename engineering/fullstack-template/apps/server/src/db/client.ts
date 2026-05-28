import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { join } from 'path'
import * as schema from './schema'

// process.cwd() works in both source mode (bun run) and compiled binary mode.
// import.meta.dir resolves to /$bunfs/root/... in compiled binaries.
// Start server with cwd = apps/server/ so all relative paths resolve correctly.
// 生产环境通过 BASE_URL 环境变量指定，不依赖 NODE_ENV（Bun 编译时会固化 NODE_ENV）
const dbPath = process.env.DATABASE_URL?.replace('file:', '') ?? join(process.cwd(), 'dev.db')
const sqlite = new Database(dbPath, { create: true })

export const db = drizzle(sqlite, { schema })

const migrationsFolder = join(process.cwd(), 'drizzle')
try {
  migrate(db, { migrationsFolder })
} catch (err) {
  console.error('[db] Migration failed:', err)
  process.exit(1)
}
