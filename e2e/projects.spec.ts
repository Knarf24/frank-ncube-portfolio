import { expect, test } from '@playwright/test'

test('project archive is reachable from the homepage', async ({ page }) => {
  await page.goto('/')

  const link = page.getByRole('link', { name: /View all projects/i })

  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', '/projects')

  const href = await link.getAttribute('href')
  expect(href).toBe('/projects')

  await page.goto(href!)

  await expect(page).toHaveURL(/\/projects$/)
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

test('Streetwise GitHub link points to the verified public repository', async ({
  page,
}) => {
  await page.goto('/projects')

  await expect(
    page.getByRole('link', { name: /View Streetwise on GitHub/i }),
  ).toHaveAttribute(
    'href',
    'https://github.com/Knarf24/streetwise-offer-ai',
  )
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
