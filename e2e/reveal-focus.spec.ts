import { expect, test } from '@playwright/test'

// Regression test: the Reveal fallback timer used to remount every section
// about 2.5 seconds after load, which silently dropped keyboard focus.
test('keyboard focus stays on the same link after the 2.5 second reveal fallback', async ({
  page,
}) => {
  await page.goto('/')

  // Wait until React has hydrated and armed the scroll reveal. The far-below
  // contact section is hidden at that point, and nothing scrolls it into
  // view. Hydration itself swaps each wrapper once, so focus is only checked
  // after that has happened.
  await expect(page.locator('#contact').locator('xpath=..')).toHaveCSS(
    'opacity',
    '0',
  )

  // A link inside a Reveal-wrapped section (the project grid).
  const link = page
    .locator('#work')
    .getByRole('link', { name: 'Read the ShopAccess AI case study' })
  await link.focus()
  await expect(link).toBeFocused()

  // Tag the live DOM node, so a remount (a new node) cannot pass unnoticed.
  await link.evaluate((el) => {
    ;(el as HTMLElement).dataset.focusProbe = 'original-node'
  })

  // Wait past the failsafe delay and its animation.
  await page.waitForTimeout(3500)

  const state = await page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null
    return {
      probe: active?.dataset.focusProbe ?? null,
      connected: Boolean(active?.isConnected),
      label: active?.getAttribute('aria-label') ?? null,
    }
  })

  expect(state.connected).toBe(true)
  expect(state.probe).toBe('original-node')
  expect(state.label).toBe('Read the ShopAccess AI case study')
})

test('sections far below the fold become visible without any scrolling', async ({
  page,
}) => {
  await page.goto('/')

  // Nothing scrolls the page, so only the failsafe can reveal this section.
  const contact = page.locator('#contact')
  await expect(contact).toBeAttached()
  await expect
    .poll(
      async () =>
        Number(
          await contact.evaluate(
            (el) => getComputedStyle(el.parentElement as HTMLElement).opacity,
          ),
        ),
      { timeout: 6000 },
    )
    .toBe(1)
})
