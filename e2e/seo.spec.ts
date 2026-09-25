import { expect, test } from '@playwright/test'

// Playwright's baseURL controls where browser/request traffic is sent.
// Canonical/Open Graph/sitemap/robots URLs are controlled by
// siteConfig.url, which resolves from this same environment contract —
// so the expected origin for SEO assertions must match it, not baseURL.
const expectedSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

test('homepage exposes title and description metadata', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(
    'Frank Ncube | Software Engineering, AI & Product Development',
  )

  await expect(
    page.locator('meta[name="description"]'),
  ).toHaveAttribute(
    'content',
    /Computer Information Sciences student/i,
  )
})

test('homepage exposes canonical and Open Graph metadata', async ({
  page,
}) => {
  await page.goto('/')

  // Next.js resolves the root canonical URL without a trailing slash.
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    expectedSiteUrl,
  )

  await expect(
    page.locator('meta[property="og:title"]'),
  ).toHaveAttribute(
    'content',
    'Frank Ncube | Software Engineering, AI & Product Development',
  )

  await expect(
    page.locator('meta[property="og:description"]'),
  ).toHaveAttribute('content', /Computer Information Sciences student/i)

  const ogImage = page.locator('meta[property="og:image"]')
  await expect(ogImage).toHaveCount(1)
  const ogImageContent = await ogImage.getAttribute('content')
  expect(ogImageContent).toContain('/opengraph-image')
})

test('sitemap includes every current public content route', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)

  const body = await response.text()

  for (const path of [
    '/',
    '/projects',
    '/resume',
    '/projects/triage360',
    '/projects/commerce-platform',
    '/projects/streetwise',
  ]) {
    expect(body).toContain(`${expectedSiteUrl}${path}`)
  }
})

test('robots allows crawling and references the sitemap', async ({
  request,
}) => {
  const response = await request.get('/robots.txt')
  expect(response.status()).toBe(200)

  const body = await response.text()

  expect(body).toMatch(/User-Agent:\s*\*/i)
  expect(body).toMatch(/Allow:\s*\//i)
  expect(body).toContain(`Sitemap: ${expectedSiteUrl}/sitemap.xml`)
})

test('the generated Open Graph image route responds with an image', async ({
  request,
}) => {
  const response = await request.get('/opengraph-image')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('image/')
})

test('homepage exposes an icon link to the generated icon route', async ({
  page,
}) => {
  await page.goto('/')

  const icon = page.locator('link[rel~="icon"]').first()
  const href = await icon.getAttribute('href')

  expect(href).toContain('/icon')
})

const pageMeta = [
  { path: '/', title: 'Frank Ncube | Software Engineering, AI & Product Development' },
  { path: '/projects', title: 'Projects | Frank Ncube' },
  { path: '/projects/triage360', title: 'Triage360 | Frank Ncube' },
  { path: '/projects/streetwise', title: 'Streetwise | Frank Ncube' },
  { path: '/projects/horizon-desk', title: 'Horizon Desk | Frank Ncube' },
  { path: '/projects/commerce-platform', title: 'Commerce platform | Frank Ncube' },
  { path: '/resume', title: 'Resume | Frank Ncube' },
]

for (const { path, title } of pageMeta) {
  test(`${path} has its own title, canonical, and Open Graph metadata`, async ({
    page,
  }) => {
    await page.goto(path)

    const expectedUrl = path === '/' ? expectedSiteUrl : `${expectedSiteUrl}${path}`

    await expect(page).toHaveTitle(title)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /\S/,
    )
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      expectedUrl,
    )
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      expectedUrl,
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      title,
    )
    await expect(
      page.locator('meta[property="og:description"]'),
    ).toHaveAttribute('content', /\S/)
    // The existing generated image is still inherited on every route.
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1)
  })
}
