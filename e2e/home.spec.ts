import { expect, test } from '@playwright/test'

test('homepage presents the approved content hierarchy', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', {
      name: 'I build technology around real problems.',
    }),
  ).toBeVisible()

  await expect(page.getByText('Livingstone College').first()).toBeVisible()
  await expect(page.getByText('Generative AI Foundations')).toBeVisible()
  await expect(page.getByText('Python', { exact: true }).first()).toBeVisible()

  await expect(page.locator('#about')).toBeAttached()
  await expect(page.locator('#experience')).toBeAttached()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
})
