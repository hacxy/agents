import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: [
    {
      command: 'bun run --cwd apps/server src/index.ts',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      env: { JWT_SECRET: 'test-secret-dev' },
    },
    {
      command: 'bun run --cwd apps/web dev',
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
  ],
})
