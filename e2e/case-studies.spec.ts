import { expect, test, type Page } from '@playwright/test'

const slugs = ['triage360', 'streetwise', 'horizon-desk', 'commerce-platform']
const widths = [320, 375, 768, 1024, 1280, 1440]

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
  ).toHaveAttribute('href', '/projects/triage360')

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

test('only Triage360 shows a product walkthrough and only Horizon Desk shows event photos', async ({
  page,
}) => {
  for (const slug of slugs) {
    await page.goto(`/projects/${slug}`)

    const event = page.locator('section[aria-labelledby="event-heading"]')
    const walkthrough = page.locator('section[aria-labelledby="walkthrough-heading"]')

    if (slug === 'horizon-desk') {
      await expect(event.locator('img')).toHaveCount(2)
      await expect(walkthrough).toHaveCount(0)
      await expect(page.locator('main img')).toHaveCount(2)
      await expect(page.getByRole('figure')).toHaveCount(2)
    } else if (slug === 'triage360') {
      await expect(walkthrough.locator('img')).toHaveCount(2)
      await expect(walkthrough.getByRole('figure')).toHaveCount(2)
      await expect(event).toHaveCount(0)
      await expect(page.locator('main img')).toHaveCount(2)
      await expect(page.getByRole('figure')).toHaveCount(2)
    } else {
      await expect(page.getByRole('figure')).toHaveCount(0)
      await expect(page.locator('main img')).toHaveCount(0)
      await expect(event).toHaveCount(0)
      await expect(walkthrough).toHaveCount(0)
    }
  }
})

test('Triage360 walkthrough: heading, order, captions, alt text, and legible native-size images', async ({
  page,
}) => {
  await page.goto('/projects/triage360')

  const walkthrough = page.locator('section[aria-labelledby="walkthrough-heading"]')
  await expect(
    walkthrough.getByRole('heading', { level: 2, name: 'Product walkthrough' }),
  ).toBeVisible()
  await expect(walkthrough).toContainText(
    'The web application running locally, using sample support tickets from the project repository.',
  )

  // Placement: The system -> Product walkthrough -> Architecture -> Engineering decisions.
  const order = await page.locator('main h2').allTextContents()
  const idx = (name: string) => order.indexOf(name)
  expect(idx('The system')).toBeGreaterThan(-1)
  expect(idx('Product walkthrough')).toBe(idx('The system') + 1)
  expect(idx('Architecture')).toBe(idx('Product walkthrough') + 1)
  expect(idx('Engineering decisions')).toBeGreaterThan(idx('Architecture'))

  await expect(
    walkthrough.getByRole('img', {
      name: 'Triage360 escalation result for a synthetic Visa fraud support ticket.',
    }),
  ).toHaveCount(1)
  await expect(
    walkthrough.getByRole('img', {
      name: 'Triage360 audit log showing five synthetic support tickets with domains, confidence and escalation status.',
    }),
  ).toHaveCount(1)
  await expect(
    walkthrough.locator('figcaption', {
      hasText: 'High-risk tickets are flagged for human review instead of receiving an automated reply.',
    }),
  ).toBeVisible()
  await expect(
    walkthrough.locator('figcaption', {
      hasText: 'The audit log records each triaged ticket with its domain, classification confidence, escalation status and retrieved-source count, with search, filters and CSV export.',
    }),
  ).toBeVisible()

  // Images load at native size, are served as-is (not re-encoded), and keep their true aspect ratios
  // (escalation 16:10, history 2.4:1 after trimming only its empty lower canvas).
  const expectedRatios = [1.6, 2.4]
  const images = walkthrough.locator('img')
  for (let i = 0; i < 2; i++) {
    const img = images.nth(i)
    await img.scrollIntoViewIfNeeded()
    await expect
      .poll(() => img.evaluate((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth))
      .toBe(2880)
    await expect(img).toHaveAttribute('src', /^\/images\/projects\/triage360\/triage360-(escalation|history)\.webp$/)
    const ratio = await img.evaluate((el) => {
      const r = el.getBoundingClientRect()
      return r.width / r.height
    })
    expect(Math.abs(ratio - expectedRatios[i])).toBeLessThan(0.01)
  }

  // No fake window dots around the real interface screenshots.
  await expect(walkthrough.locator('.rounded-full')).toHaveCount(0)

  // The primary (escalation) screenshot is visually heavier than the supporting history screenshot.
  const heights = await walkthrough.locator('img').evaluateAll((els) =>
    els.map((el) => el.getBoundingClientRect().height),
  )
  expect(heights[0]).toBeGreaterThan(heights[1] * 1.3)

  // Each caption sits directly under its own image.
  const gaps = await walkthrough.locator('figure').evaluateAll((figs) =>
    figs.map((fig) => {
      const img = fig.querySelector('img')!.getBoundingClientRect()
      const cap = fig.querySelector('figcaption')!.getBoundingClientRect()
      return cap.top - img.bottom
    }),
  )
  for (const gap of gaps) expect(gap).toBeLessThan(40)
})

test('Triage360 keeps the honest wording: rule-based escalation, keyword-overlap web retrieval, no production claims', async ({
  page,
}) => {
  await page.goto('/projects/triage360')

  const walkthrough = page.locator('section[aria-labelledby="walkthrough-heading"]')
  await expect(walkthrough).not.toContainText(/AI (detected|identified|decided)/i)
  await expect(walkthrough).not.toContainText(/AI confidence/i)
  await expect(walkthrough).not.toContainText(/production|real customers/i)
  await expect(walkthrough).not.toContainText(/TF-IDF/)
  await expect(page.getByText('Individual project')).toHaveCount(0)

  const architecture = page
    .getByRole('heading', { name: 'Architecture' })
    .locator('xpath=ancestor::div[1]')
  await expect(architecture).toContainText('keyword-overlap')
  await expect(architecture).not.toContainText('TF-IDF')
  await expect(
    page.getByText('The earlier Python CLI explored TF-IDF with semantic retrieval.', { exact: false }),
  ).toBeVisible()
})

test('Horizon Desk event section: heading, copy, alt text, captions, order, and real loaded WebP images', async ({
  page,
}) => {
  await page.goto('/projects/horizon-desk')

  const event = page.locator('section[aria-labelledby="event-heading"]')
  await expect(
    event.getByRole('heading', { level: 2, name: 'Built at SteelHacks XIII' }),
  ).toBeVisible()
  await expect(event).toContainText('University of Pittsburgh · 2026')
  await expect(
    event.getByRole('img', {
      name: 'SteelHacks XIII participants gathered in the auditorium before the closing ceremony.',
    }),
  ).toHaveCount(1)
  await expect(event.getByRole('img', { name: /three Horizon Desk team members/ })).toHaveCount(1)
  await expect(event.locator('figcaption', { hasText: 'The Horizon Desk team at SteelHacks XIII.' })).toBeVisible()
  // The redundant "Team" label and supporting sentence were removed.
  await expect(event.getByText('Horizon Desk was developed by our three-person team')).toHaveCount(0)
  await expect(event.getByText('Team', { exact: true })).toHaveCount(0)
  await expect(event.locator('figcaption')).toHaveCount(2)

  // Placement: My contribution -> event section -> Architecture -> Engineering decisions.
  const order = await page.locator('main h2').allTextContents()
  const idx = (name: string) => order.indexOf(name)
  expect(idx('My contribution')).toBeGreaterThan(-1)
  expect(idx('Built at SteelHacks XIII')).toBe(idx('My contribution') + 1)
  expect(idx('Architecture')).toBe(idx('Built at SteelHacks XIII') + 1)
  expect(idx('Engineering decisions')).toBeGreaterThan(idx('Architecture'))

  // Images load (optimized by next/image) and neither is distorted.
  const images = event.locator('img')
  for (let i = 0; i < 2; i++) {
    const img = images.nth(i)
    await img.scrollIntoViewIfNeeded()
    await expect
      .poll(() => img.evaluate((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0)
    await expect(img).toHaveAttribute('src', /_next\/image\?url=.*\.webp/)
  }

  // The portrait is never cropped: rendered ratio matches the source ratio.
  const team = images.nth(1)
  const ratio = await team.evaluate((el) => {
    const r = el.getBoundingClientRect()
    return r.width / r.height
  })
  expect(Math.abs(ratio - 1080 / 1434)).toBeLessThan(0.01)
  // The portrait stays modest and centered under the banner.
  const box = await team.evaluate((el) => {
    const r = el.getBoundingClientRect()
    const banner = document.querySelector('section[aria-labelledby="event-heading"] img')!.getBoundingClientRect()
    return { width: r.width, centerX: r.left + r.width / 2, bannerCenterX: banner.left + banner.width / 2 }
  })
  expect(box.width).toBeLessThanOrEqual(290)
  expect(Math.abs(box.centerX - box.bannerCenterX)).toBeLessThan(2)
  await expect(images.nth(0)).toHaveCSS('object-fit', 'cover')
})

test('Horizon Desk keeps every Phase 1 attribution guard alongside the event photos', async ({
  page,
}) => {
  await page.goto('/projects/horizon-desk')

  await expect(page.getByText('Team project')).toBeVisible()
  await expect(page.getByRole('list', { name: 'Team members' }).getByRole('listitem')).toHaveText([
    'Frank Ncube',
    'Gamuchirai Mubayiwa',
    'Sumon Mondal',
  ])
  await expect(page.getByText('I helped originate the project concept', { exact: false })).toBeVisible()
  await expect(page.getByRole('link', { name: /GitHub/i })).toHaveCount(0)
  await expect(page.locator('a[href*="netlify"]')).toHaveCount(0)
  await expect(page.getByText(/142/)).toHaveCount(0)
  await expect(page.getByText(/Individual project/i)).toHaveCount(0)
  await expect(page.getByText('All customer records and financial projections in the prototype are synthetic or simulated.')).toBeVisible()
  await expect(page.locator('a[href="https://devpost.com/software/nexa-j9g8ys"]').first()).toBeVisible()
})

for (const width of [320, 375, 768, 1024, 1280, 1440]) {
  test(`Horizon Desk event images stay inside the page and undistorted at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/projects/horizon-desk')
    await page.evaluate(() => document.fonts.ready)

    const result = await page.locator('section[aria-labelledby="event-heading"] img').evaluateAll((imgs) =>
      imgs.map((el) => {
        const img = el as HTMLImageElement
        const r = img.getBoundingClientRect()
        return { left: r.left, right: r.right, width: r.width, height: r.height }
      }),
    )

    expect(await hasHorizontalOverflow(page)).toBe(false)
    for (const image of result) {
      expect(image.left).toBeGreaterThanOrEqual(0)
      expect(image.right).toBeLessThanOrEqual(width + 0.5)
      expect(image.width).toBeGreaterThan(200)
    }
  })
}

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

for (const slug of ['triage360', 'streetwise', 'horizon-desk']) {
  for (const width of [640, 768, 1024, 1280, 1440]) {
    test(`${slug} architecture flow has no horizontal arrows and stays in reading order at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/projects/${slug}`)
      await page.evaluate(() => document.fonts.ready)

      const flow = page.locator('[data-flow-step]').first().locator('xpath=../..')
      const result = await flow.evaluate((container) => {
        const bounds = container.getBoundingClientRect()
        const steps = Array.from(container.querySelectorAll('[data-flow-step]'))
        const boxes = steps.map((step) => step.querySelector('[data-flow-box]')!.getBoundingClientRect())
        const visibleArrows = Array.from(container.querySelectorAll('span')).filter(
          (el) =>
            /[→↓]/.test(el.textContent ?? '') &&
            getComputedStyle(el).display !== 'none',
        ).length
        return {
          visibleArrows,
          inside: boxes.every((r) => r.right <= bounds.right + 0.5 && r.left >= bounds.left - 0.5),
          // Reading order: each step is below, or to the right of on the same row, the previous one.
          ordered: boxes.every((r, i) => {
            if (i === 0) return true
            const prev = boxes[i - 1]
            return r.top > prev.top + 4 || (Math.abs(r.top - prev.top) < 4 && r.left > prev.left)
          }),
        }
      })

      expect(result.visibleArrows).toBe(0)
      expect(result.inside).toBe(true)
      expect(result.ordered).toBe(true)
    })
  }
}

test('architecture flow keeps its vertical arrows on phones', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 })
  await page.goto('/projects/horizon-desk')

  const arrows = page.locator('[data-flow-step] span', { hasText: '↓' })
  await expect(arrows).toHaveCount(4)
  await expect(arrows.first()).toBeVisible()
})

test('glance strip is a clean list on phones, uses the width at 768px, and gives Stack extra room on desktop', async ({
  page,
}) => {
  const measure = () =>
    page.locator('dl[aria-label$="at a glance"]').evaluate((dl) => {
      const items = Array.from(dl.children).map((child) => {
        const r = child.getBoundingClientRect()
        return {
          label: child.querySelector('dt')!.textContent!,
          x: r.left,
          y: r.top,
          w: r.width,
        }
      })
      return { items, height: dl.getBoundingClientRect().height }
    })

  await page.setViewportSize({ width: 375, height: 900 })
  await page.goto('/projects/horizon-desk')
  const phone = await measure()
  expect(new Set(phone.items.map((i) => Math.round(i.y))).size).toBe(phone.items.length)

  await page.setViewportSize({ width: 768, height: 900 })
  const tablet = await measure()
  expect(new Set(tablet.items.map((i) => Math.round(i.y))).size).toBeLessThan(tablet.items.length)
  expect(tablet.height).toBeLessThan(phone.height * 0.6)

  await page.setViewportSize({ width: 1280, height: 900 })
  const desktop = await measure()
  const stack = desktop.items.find((i) => i.label === 'Stack')!
  const year = desktop.items.find((i) => i.label === 'Year')!
  expect(stack.w).toBeGreaterThanOrEqual(year.w * 3)
  expect(stack.w).toBeGreaterThanOrEqual(288)
})

test('stack technologies are non-breaking units in a clipped list, so no separator can start or end a line', async ({
  page,
}) => {
  for (const width of [320, 375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/projects/horizon-desk')

    const stack = page.locator('dl[aria-label$="at a glance"] ul')
    await expect(stack).toHaveCSS('overflow', 'hidden')

    const items = stack.locator('li')
    expect(await items.count()).toBe(6)
    for (let i = 0; i < 6; i++) {
      await expect(items.nth(i)).toHaveCSS('white-space', 'nowrap')
    }
    await expect(stack).not.toContainText('·')
  }
})

test('TF-IDF never breaks across lines on Triage360', async ({ page }) => {
  for (const width of [320, 375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/projects/triage360')
    await page.evaluate(() => document.fonts.ready)

    const result = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.querySelector('main')!, NodeFilter.SHOW_TEXT)
      const found: { nowrap: boolean; lines: number }[] = []
      let node: Node | null
      while ((node = walker.nextNode())) {
        if (!node.textContent?.includes('TF-IDF')) continue
        const parent = node.parentElement!
        const range = document.createRange()
        const start = node.textContent.indexOf('TF-IDF')
        range.setStart(node, start)
        range.setEnd(node, start + 6)
        const tops = new Set(Array.from(range.getClientRects()).map((r) => Math.round(r.top)))
        found.push({ nowrap: getComputedStyle(parent).whiteSpace === 'nowrap', lines: tops.size })
      }
      return found
    })

    expect(result.length).toBeGreaterThan(0)
    for (const entry of result) {
      expect(entry.lines).toBe(1)
    }
  }
})

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
