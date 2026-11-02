import { expect, test } from '@playwright/test'

// Regression tests for hydration. React first hydrates the server HTML and
// then Reveal arms its scroll animation. That step used to swap every
// server-rendered section for brand-new DOM nodes, which silently dropped
// keyboard focus for anyone who had already started tabbing. These tests
// hold the JavaScript back, so focus can be set while the page is still
// unhydrated, and then let hydration run.

const CASE_STUDY_LINK = 'Read the ShopAccess AI case study'

// Holds every Next.js script until release() is called.
async function holdScripts(page: import('@playwright/test').Page) {
  let release!: () => void
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/_next/static/**/*.js', async (route) => {
    await gate
    await route.continue()
  })
  return release
}

// The far-below contact section is hidden once the scroll reveal is armed,
// and nothing here scrolls it into view. This is the "hydrated" signal.
function contactWrapper(page: import('@playwright/test').Page) {
  return page.locator('#contact').locator('xpath=..')
}

test('keyboard focus set before hydration survives hydration and the 2.5 second fallback', async ({
  page,
  browserName,
}) => {
  // macOS WebKit follows Safari: plain Tab skips links and Option+Tab moves
  // through them. Only the key differs; the assertions are the same.
  const nextKey =
    browserName === 'webkit' && process.platform === 'darwin'
      ? 'Alt+Tab'
      : 'Tab'

  const release = await holdScripts(page)
  await page.goto('/', { waitUntil: 'commit' })

  const link = page
    .locator('#work')
    .getByRole('link', { name: CASE_STUDY_LINK })
  await link.waitFor({ state: 'attached' })

  // Unhydrated: content is already visible, with no JavaScript at all.
  await expect(contactWrapper(page)).toHaveCSS('opacity', '1')

  // A keyboard user starts tabbing before hydration: focus the link, then Tab
  // to the next link in the same section.
  await link.focus()
  await page.keyboard.press(nextKey)
  const nextLinkLabel = await page.evaluate(
    () => document.activeElement?.getAttribute('aria-label') ?? null,
  )
  expect(nextLinkLabel).toMatch(/demo video/i)
  await page.evaluate(() => {
    ;(document.activeElement as HTMLElement).dataset.focusProbe = 'original-node'
  })

  // Let hydration run, and wait until the scroll reveal is armed.
  release()
  await expect(contactWrapper(page)).toHaveCSS('opacity', '0')

  const afterHydration = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null
    return { probe: el?.dataset.focusProbe ?? null, connected: !!el?.isConnected }
  })
  expect(afterHydration.connected).toBe(true)
  expect(afterHydration.probe).toBe('original-node')

  // And it is still the same node after the 2.5 second failsafe.
  await page.waitForTimeout(3500)
  const afterFallback = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null
    return { probe: el?.dataset.focusProbe ?? null, connected: !!el?.isConnected }
  })
  expect(afterFallback.connected).toBe(true)
  expect(afterFallback.probe).toBe('original-node')
})

test('server-rendered DOM nodes are kept, not replaced, by hydration', async ({
  page,
}) => {
  const release = await holdScripts(page)
  await page.goto('/', { waitUntil: 'commit' })

  const link = page
    .locator('#work')
    .getByRole('link', { name: CASE_STUDY_LINK })
  await link.waitFor({ state: 'attached' })
  await link.evaluate((el) => {
    ;(el as HTMLElement).dataset.nodeProbe = 'server-rendered'
  })

  release()
  await expect(contactWrapper(page)).toHaveCSS('opacity', '0')

  await expect(link).toHaveAttribute('data-node-probe', 'server-rendered')
})

test('hydration logs no React hydration warnings or errors', async ({ page }) => {
  const problems: string[] = []
  const hydrationProblem =
    /hydrat|did not match|didn't match|text content does not match|Minified React error #(418|419|422|423|425)/i

  page.on('console', (message) => {
    if (
      ['error', 'warning'].includes(message.type()) &&
      hydrationProblem.test(message.text())
    ) {
      problems.push(message.text().slice(0, 160))
    }
  })
  page.on('pageerror', (error) => {
    if (hydrationProblem.test(error.message)) {
      problems.push(error.message.slice(0, 160))
    }
  })

  for (const path of ['/', '/projects', '/projects/etenmall', '/resume']) {
    await page.goto(path, { waitUntil: 'networkidle' })
    // Past the 2.5 second failsafe, so the fallback path runs too.
    await page.waitForTimeout(3000)
  }

  expect(problems).toEqual([])
})

test('arming and firing the reveal causes no layout shift', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'The layout-shift API is Chromium only')

  await page.addInitScript(() => {
    const w = window as unknown as { __cls: number }
    w.__cls = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as {
        value: number
        hadRecentInput: boolean
      }[]) {
        if (!entry.hadRecentInput) w.__cls += entry.value
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })

  await page.goto('/')
  await page.waitForTimeout(3500)

  const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls)
  // 0.1 is the "good" threshold; this page measures about 0.003.
  expect(cls).toBeLessThan(0.05)
})
