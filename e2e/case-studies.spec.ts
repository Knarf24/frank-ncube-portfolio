import { expect, test, type Page } from '@playwright/test'

const slugs = ['triage360', 'commerce-platform', 'streetwise', 'horizon-desk']
const widths = [320, 375, 768, 1024, 1280]

async function hasHorizontalOverflow(page: Page) {
  return page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  )
}

for (const slug of slugs) {
  for (const width of widths) {
    test(`/projects/${slug} has no horizontal overflow at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/projects/${slug}`)
      await page.evaluate(() => document.fonts.ready)

      expect(await hasHorizontalOverflow(page)).toBe(false)
    })
  }

  test(`/projects/${slug} has a glance list, one h1, and a footer with next steps`, async ({
    page,
  }) => {
    await page.goto(`/projects/${slug}`)

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.locator('dl[aria-label$="at a glance"]')).toBeVisible()

    const footer = page.locator('main footer')
    await expect(
      footer.getByRole('link', { name: /Previous project/ }),
    ).toBeVisible()
    await expect(
      footer.getByRole('link', { name: /Next project/ }),
    ).toBeVisible()
    await expect(footer.getByRole('link', { name: 'All projects' })).toHaveAttribute(
      'href',
      '/projects',
    )
    await expect(footer.getByRole('link', { name: 'Contact me' })).toHaveAttribute(
      'href',
      '/#contact',
    )
  })

  test(`/projects/${slug} never claims to be an individual project`, async ({
    page,
  }) => {
    await page.goto(`/projects/${slug}`)

    await expect(page.getByText('Individual project')).toHaveCount(0)
  })
}

test('footer tap targets are at least 44px tall on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/projects/streetwise')

  const links = page.locator('main footer a')
  const count = await links.count()
  expect(count).toBeGreaterThanOrEqual(4)

  for (let i = 0; i < count; i++) {
    const box = await links.nth(i).boundingBox()
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
  }
})

test('previous/next navigation goes to deterministic neighbours', async ({
  page,
}) => {
  await page.goto('/projects/streetwise')

  await expect(
    page.locator('main footer').getByRole('link', { name: /Next project/ }),
  ).toHaveAttribute('href', '/projects/horizon-desk')
  await expect(
    page.locator('main footer').getByRole('link', { name: /Previous project/ }),
  ).toHaveAttribute('href', '/projects/commerce-platform')

  await page.locator('main footer').getByRole('link', { name: /Next project/ }).click()
  await expect(page).toHaveURL(/\/projects\/horizon-desk$/)
})

test('the footer can be reached and activated with the keyboard', async ({
  page,
}) => {
  await page.goto('/projects/streetwise')

  const next = page
    .locator('main footer')
    .getByRole('link', { name: /Next project/ })

  let focused = false
  for (let i = 0; i < 80 && !focused; i++) {
    await page.keyboard.press('Tab')
    focused = await next.evaluate((el) => el === document.activeElement)
  }
  expect(focused).toBe(true)

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/projects\/horizon-desk$/)
})

test('Horizon Desk lists all three teammates and no GitHub or live-demo link', async ({
  page,
}) => {
  await page.goto('/projects/horizon-desk')

  const team = page.getByRole('list', { name: 'Team members' })
  await expect(team.getByRole('listitem')).toHaveText([
    'Frank Ncube',
    'Gamuchirai Mubayiwa',
    'Sumon Mondal',
  ])
  await expect(page.getByText('Team project')).toBeVisible()
  await expect(
    page.getByText(
      'I helped originate the project concept, worked primarily on the frontend, and contributed to some of the backend development.',
    ),
  ).toBeVisible()

  await expect(page.getByRole('link', { name: /GitHub/i })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /live/i })).toHaveCount(0)
  await expect(page.locator('a[href*="netlify"]')).toHaveCount(0)
  await expect(page.getByText(/142/)).toHaveCount(0)

  const glance = page.locator('dl[aria-label$="at a glance"]')
  await expect(glance).toContainText('Frontend + supporting backend')
  await expect(glance).toContainText('3 developers')
  await expect(glance).toContainText('SteelHacks XIII')
  await expect(glance).toContainText('Completed prototype')

  await expect(
    page.getByRole('img', {
      name: /Synthetic customer data to Deterministic eligibility checks to AI-assisted outreach to Simulated responses and cooldowns to Human banker review for credit opportunities/i,
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Engineering decisions' }),
  ).toBeVisible()
})

test('Commerce platform is private: in development, no repo link, preview, or architecture', async ({
  page,
}) => {
  await page.goto('/projects/commerce-platform')

  await expect(page.locator('dl[aria-label$="at a glance"]')).toContainText(
    'Product & Software Development',
  )
  await expect(page.locator('dl[aria-label$="at a glance"]')).toContainText(
    'In development',
  )
  await expect(page.locator('main a[href*="github.com"]')).toHaveCount(0)
  await expect(page.getByRole('figure')).toHaveCount(0)
  await expect(
    page.getByRole('heading', { name: 'Architecture' }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('heading', { name: 'Engineering decisions' }),
  ).toHaveCount(0)
})

test('Triage360 architecture describes web-app retrieval as keyword-overlap', async ({
  page,
}) => {
  await page.goto('/projects/triage360')

  const architecture = page
    .getByRole('heading', { name: 'Architecture' })
    .locator('xpath=ancestor::div[1]')

  await expect(architecture).toContainText('keyword-overlap')
  await expect(architecture).not.toContainText('TF-IDF')
  await expect(
    page.getByRole('heading', { name: 'Engineering decisions' }),
  ).toBeVisible()
  await expect(page.getByRole('listitem').filter({ hasText: /Rule-based escalation/ })).toHaveCount(1)
})

test('no project renders a product preview until real screenshots are added', async ({
  page,
}) => {
  for (const slug of slugs) {
    await page.goto(`/projects/${slug}`)
    await expect(page.getByRole('figure')).toHaveCount(0)
    await expect(page.locator('main img')).toHaveCount(0)
  }
})

test('Triage360 and Streetwise no longer use the What I built heading', async ({
  page,
}) => {
  for (const slug of ['triage360', 'streetwise']) {
    await page.goto(`/projects/${slug}`)
    await expect(page.getByRole('heading', { name: 'The system' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /What I built/i })).toHaveCount(0)
  }
  await page.goto('/projects/horizon-desk')
  await expect(page.getByRole('heading', { name: 'The team prototype' })).toBeVisible()
  await page.goto('/projects/commerce-platform')
  await expect(page.getByRole('heading', { name: 'What I am building' })).toBeVisible()
})

for (const slug of ['triage360', 'horizon-desk']) {
  for (const width of [768, 1024, 1280]) {
    test(`${slug} architecture flow keeps each connector with its step at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/projects/${slug}`)
      await page.evaluate(() => document.fonts.ready)

      const flow = page.locator('[data-flow-step]').first().locator('xpath=../..')
      const result = await flow.evaluate((container) => {
        const bounds = container.getBoundingClientRect()
        const steps = Array.from(container.querySelectorAll('[data-flow-step]'))
        return steps.map((step, index) => {
          const box = step.querySelector('[data-flow-box]')!.getBoundingClientRect()
          const connector = step.querySelector('[data-flow-connector]')
          const c = connector?.getBoundingClientRect()
          return {
            index,
            hasConnector: Boolean(connector),
            insideContainer:
              step.getBoundingClientRect().right <= bounds.right + 0.5 &&
              step.getBoundingClientRect().left >= bounds.left - 0.5,
            connectorAfterBox: c ? c.left >= box.right - 0.5 : true,
            connectorSameRow: c
              ? Math.abs((c.top + c.height / 2) - (box.top + box.height / 2)) < 4
              : true,
          }
        })
      })

      const last = result.length - 1
      for (const step of result) {
        expect(step.insideContainer).toBe(true)
        expect(step.connectorAfterBox).toBe(true)
        expect(step.connectorSameRow).toBe(true)
        expect(step.hasConnector).toBe(step.index < last)
      }
    })
  }
}

test('case studies stay static and immediate with reduced motion (no reveal fade)', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/projects/horizon-desk')

  const heading = page.getByRole('heading', { name: 'Problem' })
  await expect(heading).toBeVisible()

  const opacity = await heading
    .locator('xpath=ancestor::main')
    .evaluate((el) => getComputedStyle(el).opacity)
  expect(Number(opacity)).toBe(1)
})

test('case-study pages use no reveal animation even with motion enabled', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/projects/streetwise')

  const opacities = await page
    .locator('main section')
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity))

  expect(opacities.length).toBeGreaterThan(0)
  for (const opacity of opacities) expect(Number(opacity)).toBe(1)
})
