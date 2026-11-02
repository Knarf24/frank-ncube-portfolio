import { expect, test } from '@playwright/test'

// CI must test the production build (`next start`), not the dev server.
// This test proves it from behavior, not from config: Next.js serves its
// hashed script files as immutable only in production, and as no-store in
// development. It only runs when CI selects the production server.
test.skip(!process.env.CI, 'Local runs use the dev server by design')

test('the server under test is the production server, not the dev server', async ({
  request,
}) => {
  const html = await (await request.get('/')).text()
  const src = html.match(/<script[^>]+src="(\/_next\/static\/[^"]+\.js)"/)?.[1]
  expect(src, 'a hashed Next.js script on the home page').toBeTruthy()

  const response = await request.get(src as string)
  expect(response.ok()).toBe(true)
  const cacheControl = response.headers()['cache-control'] ?? ''
  expect(cacheControl).toContain('immutable')
  expect(cacheControl).not.toContain('no-store')

  // The dev server also exposes its HMR/dev-only endpoints; production must not.
  const dev = await request.get('/_next/webpack-hmr')
  expect([404, 400, 405]).toContain(dev.status())
})
