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

test('Triage360 has a dedicated engineering case study', async ({ page }) => {
  await page.goto('/projects/triage360')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Triage360',
    }),
  ).toBeVisible()

  await expect(
    page.getByRole('heading', { name: 'Problem' }),
  ).toBeVisible()

  await expect(
    page.getByRole('heading', { name: 'Architecture' }),
  ).toBeVisible()

  await expect(
    page.getByRole('link', { name: /GitHub/i }),
  ).toHaveAttribute(
    'href',
    'https://github.com/Knarf24/support-triangle-agent',
  )
})

test('the archive Case study link opens the Triage360 case study', async ({
  page,
}) => {
  await page.goto('/projects')

  await page
    .getByRole('link', { name: /Read the Triage360 case study/i })
    .click()

  await expect(page).toHaveURL(/\/projects\/triage360$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Triage360' }),
  ).toBeVisible()
})

test('Commerce platform renders only its existing case-study sections', async ({
  page,
}) => {
  await page.goto('/projects/commerce-platform')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Commerce platform' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Problem' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'What I am building' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Architecture' }),
  ).not.toBeVisible()
})

test('Streetwise renders only its existing case-study sections', async ({
  page,
}) => {
  await page.goto('/projects/streetwise')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Streetwise' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Problem' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'What I built' }),
  ).toBeVisible()
})

test('an unknown project slug renders the not-found page', async ({
  page,
}) => {
  const response = await page.goto('/projects/this-project-does-not-exist')

  expect(response?.status()).toBe(404)
  await expect(
    page.getByRole('heading', { name: 'Problem' }),
  ).not.toBeVisible()
})
