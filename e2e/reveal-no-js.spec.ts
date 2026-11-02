import { expect, test } from '@playwright/test'

// Sections are server-rendered fully visible. They only get hidden after
// React hydrates, so nothing may stay hidden when JavaScript is off.
test.use({ javaScriptEnabled: false })

test('every revealed section is visible with JavaScript disabled', async ({
  page,
}) => {
  await page.goto('/')

  for (const name of [
    'Projects built around real problems.',
    'I build technology around real problems.',
    'Education & achievements',
    'Tools I build with',
    'Have an internship, project, or interesting problem?',
  ]) {
    await expect(page.getByRole('heading', { name })).toBeVisible()
  }

  // The wrapper around each section must be fully opaque and untransformed.
  const wrappers = page
    .locator('#work, #about, #contact')
    .locator('xpath=..')
  expect(await wrappers.count()).toBe(3)
  for (const state of await wrappers.evaluateAll((els) =>
    els.map((el) => {
      const style = getComputedStyle(el)
      return { opacity: style.opacity, transform: style.transform }
    }),
  )) {
    expect(state).toEqual({ opacity: '1', transform: 'none' })
  }

  // The project links are real, clickable links without any script.
  await expect(
    page.getByRole('link', { name: 'Read the ShopAccess AI case study' }),
  ).toHaveAttribute('href', '/projects/shopaccess-ai')
})
