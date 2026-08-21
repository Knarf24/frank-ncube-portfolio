import { expect, test } from '@playwright/test'

test('homepage presents the approved content hierarchy', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', {
      name: 'I build technology around real problems.',
    }),
  ).toBeVisible()

  const educationSection = page.locator('section', {
    has: page.getByRole('heading', { name: 'Education & achievements' }),
  })
  const toolkitSection = page.locator('section', {
    has: page.getByRole('heading', { name: 'Technical toolkit' }),
  })

  await expect(
    educationSection.getByText('Livingstone College', { exact: true }),
  ).toBeVisible()
  await expect(page.getByText('Generative AI Foundations')).toBeVisible()
  await expect(
    toolkitSection.getByText('Python', { exact: true }),
  ).toBeVisible()

  await expect(page.locator('#about')).toBeAttached()
  await expect(page.locator('#experience')).toBeAttached()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
})
