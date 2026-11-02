import { expect, test } from '@playwright/test'

const paths = ['/', '/projects/etenmall', '/resume', '/resume/Frank_Dumoluhle_Ncube_Resume.pdf']

for (const path of paths) {
  test(`${path} sends the security headers`, async ({ request }) => {
    const response = await request.get(path)
    expect(response.ok()).toBe(true)

    const headers = response.headers()
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['permissions-policy']).toContain('camera=()')
    // Same-origin framing only: other sites cannot embed this one.
    expect(headers['content-security-policy']).toBe("frame-ancestors 'self'")
    expect(headers['x-frame-options']).toBe('SAMEORIGIN')
  })
}

test('the resume page still embeds its own PDF in a same-origin viewer', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/resume')

  const embed = page.locator('object[type="application/pdf"]')
  await expect(embed).toBeAttached()
  // The embedded file is same-origin, which 'frame-ancestors self' allows.
  expect(new URL((await embed.getAttribute('data')) ?? '', page.url()).origin).toBe(
    new URL(page.url()).origin,
  )
})
