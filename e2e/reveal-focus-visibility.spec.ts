import { expect, test, type Page } from '@playwright/test'

// Focus retention is not enough: a focused link inside a section that is
// momentarily transparent has no visible focus ring. These tests sample the
// focused link's EFFECTIVE opacity (its own opacity times every ancestor's)
// on every animation frame and require it to stay fully visible.

type Sample = [t: number, opacity: number, focused: 0 | 1]
type Sampler = {
  sel: Record<string, string>
  s: Record<string, Sample[]>
  t0: number | null
}

const VIEWPORTS = [
  { name: '1440px', width: 1440, height: 900 },
  { name: '390px', width: 390, height: 844 },
  { name: '320px', width: 320, height: 700 },
]

const WORK_LINK = '#work a[aria-label="Read the ShopAccess AI case study"]'
const WORK_LAST_LINK = '#work a[href="/projects"]'
const CONTACT_LINK = '#contact a[href^="mailto:"]'
const CONTACT = '#contact'

async function installSampler(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __v: Sampler }
    w.__v = { sel: {}, s: {}, t0: null }
    const tick = () => {
      for (const [name, selector] of Object.entries(w.__v.sel)) {
        const el = document.querySelector(selector)
        if (el && w.__v.t0 !== null) {
          let opacity = 1
          for (let n: Element | null = el; n; n = n.parentElement) {
            opacity *= Number(getComputedStyle(n).opacity)
          }
          ;(w.__v.s[name] ??= []).push([
            Math.round(performance.now() - w.__v.t0),
            opacity,
            document.activeElement === el ? 1 : 0,
          ])
        }
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

const track = (page: Page, name: string, selector: string) =>
  page.evaluate(
    ([n, s]) => {
      ;(window as unknown as { __v: Sampler }).__v.sel[n] = s
    },
    [name, selector],
  )

const startSampling = (page: Page) =>
  page.evaluate(() => {
    const v = (window as unknown as { __v: Sampler }).__v
    v.s = {}
    v.t0 = performance.now()
  })

const readSamples = (page: Page, name: string) =>
  page.evaluate(
    (n) => (window as unknown as { __v: Sampler }).__v.s[n] ?? [],
    name,
  )

async function holdScripts(page: Page) {
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

// React attaches its props object to a DOM node when it hydrates it.
const hydrated = (page: Page, selector: string) =>
  page.waitForFunction(
    (s) => {
      const el = document.querySelector(s)
      return !!el && Object.keys(el).some((k) => k.startsWith('__reactProps'))
    },
    selector,
  )

const min = (samples: Sample[]) => Math.min(...samples.map((x) => x[1]))

for (const vp of VIEWPORTS) {
  test.describe(`at ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    for (const [label, selector] of [
      ['a link in view (project grid)', WORK_LINK],
      ['a link far down the page (contact)', CONTACT_LINK],
    ] as const) {
      test(`${label}, focused before hydration, stays fully visible while hydration runs`, async ({
        page,
      }) => {
        await installSampler(page)
        const release = await holdScripts(page)
        await page.goto('/', { waitUntil: 'commit' })
        await track(page, 'focused', selector)

        const link = page.locator(selector)
        await link.waitFor({ state: 'attached' })
        await link.focus()
        await page.waitForTimeout(300)

        await startSampling(page)
        release()
        await hydrated(page, selector)
        // Through hydration, the reveal arming, and a bit past it.
        await page.waitForTimeout(1500)

        const samples = await readSamples(page, 'focused')
        expect(samples.length).toBeGreaterThan(20)
        // Never transparent, on any frame, from hydration onward.
        expect(min(samples)).toBeGreaterThanOrEqual(0.99)
        // And focus was never dropped.
        expect(samples.every((x) => x[2] === 1)).toBe(true)
      })
    }

    test('sections that do not contain focus still hide and reveal as before', async ({
      page,
    }) => {
      await installSampler(page)
      const release = await holdScripts(page)
      await page.goto('/', { waitUntil: 'commit' })
      await track(page, 'focused', WORK_LINK)
      await track(page, 'contact', CONTACT_LINK)

      const link = page.locator(WORK_LINK)
      await link.waitFor({ state: 'attached' })
      await link.focus()
      await page.waitForTimeout(300)

      await startSampling(page)
      release()
      await hydrated(page, WORK_LINK)
      // The 2.5 second failsafe fires inside this window.
      await page.waitForTimeout(4000)

      const contact = await readSamples(page, 'contact')
      expect(min(contact)).toBeLessThanOrEqual(0.05) // it was hidden...
      expect(contact[contact.length - 1][1]).toBeGreaterThanOrEqual(0.99) // ...then revealed
    })

    test('keyboard navigation into a still-hidden section is never invisible', async ({
      page,
      browserName,
    }) => {
      // macOS WebKit follows Safari: plain Tab skips links, Option+Tab moves
      // through them. Only the key differs; the assertions are the same.
      const nextKey =
        browserName === 'webkit' && process.platform === 'darwin'
          ? 'Alt+Tab'
          : 'Tab'

      await installSampler(page)
      await page.goto('/', { waitUntil: 'networkidle' })
      await hydrated(page, CONTACT_LINK)
      // The whole contact section, so its wrapper's opacity is included.
      await track(page, 'contact', CONTACT)

      // Frame-independent measurement: the moment focus enters #contact, in
      // the focusin event itself, record the focused element's effective
      // opacity. (Registered after hydration, so React's handler has run.)
      await page.evaluate(() => {
        const w = window as unknown as { __focusOpacity: number[] }
        w.__focusOpacity = []
        document.addEventListener('focusin', (event) => {
          const target = event.target as Element
          if (!target.closest('#contact')) return
          let opacity = 1
          for (let n: Element | null = target; n; n = n.parentElement) {
            opacity *= Number(getComputedStyle(n).opacity)
          }
          w.__focusOpacity.push(opacity)
        })
      })

      // Focus the last link of the project grid, then Tab onward.
      await page.locator(WORK_LAST_LINK).evaluate((el) => {
        ;(el as HTMLElement).focus({ preventScroll: true })
      })
      await startSampling(page)
      await page.waitForTimeout(150)

      // Premise: the section really is hidden before focus arrives.
      await expect(page.locator(CONTACT).locator('xpath=..')).toHaveCSS(
        'opacity',
        '0',
      )

      let landedAt = -1
      for (let i = 0; i < 8 && landedAt < 0; i++) {
        await page.keyboard.press(nextKey)
        landedAt = await page.evaluate(() => {
          const v = (window as unknown as { __v: Sampler }).__v
          return document.activeElement?.closest('#contact')
            ? Math.round(performance.now() - (v.t0 as number))
            : -1
        })
      }
      expect(landedAt).toBeGreaterThan(0) // keyboard really reached the section
      await page.waitForTimeout(800)

      // At the instant focus entered the section it was already fully visible.
      const atFocus = await page.evaluate(
        () => (window as unknown as { __focusOpacity: number[] }).__focusOpacity,
      )
      expect(atFocus.length).toBeGreaterThan(0)
      expect(Math.min(...atFocus)).toBe(1)

      // And it never dipped afterwards (no fade-in, no relapse into hiding).
      const samples = await readSamples(page, 'contact')
      const after = samples.filter((x) => x[0] >= landedAt + 60)
      expect(after.length).toBeGreaterThan(0)
      expect(min(after)).toBeGreaterThanOrEqual(0.99)
    })

    test('focus arriving in a hidden section makes it visible immediately, without a fade', async ({
      page,
    }) => {
      await installSampler(page)
      await page.goto('/', { waitUntil: 'networkidle' })
      await hydrated(page, CONTACT_LINK)
      await track(page, 'contact', CONTACT_LINK)
      await startSampling(page)

      const wrapper = page.locator(CONTACT).locator('xpath=..')
      await expect(wrapper).toHaveCSS('opacity', '0') // armed and hidden

      // preventScroll isolates this from the scroll-triggered reveal: only
      // the focus handler can make the section visible here.
      const { focusedAt, opacityRightAfterFocus } = await page
        .locator(CONTACT_LINK)
        .evaluate((el) => {
          ;(el as HTMLElement).focus({ preventScroll: true })
          // Same task as the focus event: no animation frame has run yet.
          let opacity = 1
          for (let n: Element | null = el; n; n = n.parentElement) {
            opacity *= Number(getComputedStyle(n).opacity)
          }
          const v = (window as unknown as { __v: Sampler }).__v
          return {
            focusedAt: Math.round(performance.now() - (v.t0 as number)),
            opacityRightAfterFocus: opacity,
          }
        })
      expect(opacityRightAfterFocus).toBe(1) // visible at once, not after a frame

      await page.waitForTimeout(600)
      const samples = await readSamples(page, 'contact')
      const after = samples.filter((x) => x[0] >= focusedAt + 50)
      expect(after.length).toBeGreaterThan(0)
      expect(min(after)).toBeGreaterThanOrEqual(0.99) // and it stays visible
    })
  })
}
