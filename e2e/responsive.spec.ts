import { expect, test } from '@playwright/test'

for (const width of [320, 375, 430, 768, 1024, 1440]) {
  test(`homepage has no horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    )

    expect(overflow).toBe(false)
  })
}

// Compact route-level regression at the narrowest supported width, since
// homepage-only coverage does not guarantee the archive, case studies, or
// resume placeholder stay overflow-free.
for (const route of [
  '/projects',
  '/projects/triage360',
  '/projects/commerce-platform',
  '/projects/streetwise',
  '/resume',
]) {
  test(`${route} has no horizontal overflow at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 })
    await page.goto(route)
    await page.evaluate(() => document.fonts.ready)

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    )

    expect(overflow).toBe(false)
  })
}
