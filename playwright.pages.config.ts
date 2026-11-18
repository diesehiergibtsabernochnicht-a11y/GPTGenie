import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4174/GPTGenie/',
    headless: true,
    viewport: { width: 1440, height: 1000 },
  },
  webServer: {
    command: 'npm run preview -- --port 4174',
    url: 'http://127.0.0.1:4174/GPTGenie/',
    env: { GITHUB_PAGES: 'true' },
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
