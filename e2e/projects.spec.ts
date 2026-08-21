import { expect, test } from '@playwright/test'

test('project archive is reachable from the homepage', async ({ page }) => {
  await page.goto('/')

  // The homepage sections mount via a client-side reveal wrapper that
  // remounts once immediately after hydration. Retrying the click keeps
  // this test resilient to that transient remount instead of depending
  // on exact hydration timing.
  await expect(async () => {
    await page
      .getByRole('link', { name: /View all projects/i })
      .click()
    await expect(page).toHaveURL(/\/projects$/, { timeout: 2000 })
  }).toPass({ timeout: 15000 })

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Projects',
    }),
  ).toBeVisible()
})

test('AI / ML filter narrows the archive to matching projects', async ({
  page,
}) => {
  await page.goto('/projects')

  const aiButton = page.getByRole('button', { name: 'AI / ML' })
  await aiButton.click()

  await expect(aiButton).toHaveAttribute('aria-pressed', 'true')
  await expect(
    page.getByRole('heading', { name: 'Triage360' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Streetwise' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Commerce platform' }),
  ).not.toBeVisible()
})
