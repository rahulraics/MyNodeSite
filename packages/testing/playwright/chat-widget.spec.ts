import { test, expect } from '@playwright/test'

test('first load and open close', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Chat')
  await expect(page.locator('text=AI can make mistakes')).toBeVisible()
  await page.click('text=Close')
})

test('rest flow renders assistant message', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Chat')
  await page.fill('input', 'hello')
  await page.click('button:has-text("Send")')
  await expect(page.locator('[data-role="assistant"]').last()).toContainText('Hello world')
})

test('mobile viewport behavior', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.click('text=Chat')
  await expect(page.locator('input')).toBeVisible()
})
