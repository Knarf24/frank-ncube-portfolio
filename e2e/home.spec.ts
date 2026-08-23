import { expect, test } from '@playwright/test'

test('homepage presents the approved content hierarchy', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', {
      name: 'I build technology around real problems.',
    }),
  ).toBeVisible()

  const educationSection = page.locator('section', {
    has: page.getByRole('heading', { name: 'Education & achievements' }),
  })
  const toolkitSection = page.locator('section', {
    has: page.getByRole('heading', { name: 'Tools I build with' }),
  })

  await expect(
    educationSection.getByText('Livingstone College', { exact: true }),
  ).toBeVisible()
  await expect(page.getByText('Generative AI Foundations')).toBeVisible()
  // "Python" is conveyed to sighted users via the logo marquee and stays
  // available to assistive technology through an always-present text list.
  await expect(
    toolkitSection.getByText('Python', { exact: true }),
  ).toBeAttached()

  await expect(page.locator('#about')).toBeAttached()
  await expect(page.locator('#experience')).toBeAttached()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
})

test('hero portrait renders with meaningful alt text', async ({ page }) => {
  await page.goto('/')

  const portrait = page.getByRole('img', { name: 'Portrait of Frank Ncube' })
  await expect(portrait).toBeVisible()
  await expect(portrait).toHaveAttribute(
    'src',
    /frank-ncube-portrait\.png/,
  )
})

test('contact links point to the verified profiles', async ({ page }) => {
  await page.goto('/')

  const contactSection = page.locator('#contact')
  await expect(contactSection).toBeAttached()

  // The compact GitHub/LinkedIn/Resume cards repeat the same labels as the
  // primary actions above them, so multiple matches are expected inside
  // this section — both point to the identical verified href.
  await expect(
    contactSection.getByRole('link', { name: /LinkedIn/i }).first(),
  ).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/frank-ncube-417a52338',
  )

  await expect(
    contactSection.getByRole('link', { name: /GitHub/i }).first(),
  ).toHaveAttribute('href', 'https://github.com/Knarf24')

  await expect(
    contactSection.getByRole('link', { name: 'Email me' }),
  ).toHaveAttribute('href', 'mailto:FNcube83@students.livingstone.edu')

  await expect(
    contactSection.getByRole('link', { name: /View resume/i }).first(),
  ).toHaveAttribute('href', '/resume')
})

test('header navigation from a non-home route returns to homepage sections', async ({
  page,
}) => {
  await page.goto('/projects')

  await page.getByRole('link', { name: 'Work', exact: true }).click()
  await expect(page).toHaveURL(/\/#work$/)
  await expect(page.locator('#work')).toBeAttached()

  await page.goto('/resume')

  await page.getByRole('link', { name: 'Contact', exact: true }).click()
  await expect(page).toHaveURL(/\/#contact$/)
  await expect(page.locator('#contact')).toBeAttached()
})

test('resume route offers the permanent resume PDF for viewing and download', async ({
  page,
}) => {
  await page.goto('/resume')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Resume',
    }),
  ).toBeVisible()

  const openLink = page.getByRole('link', { name: 'Open resume PDF' })
  await expect(openLink).toHaveAttribute(
    'href',
    '/resume/Frank_Dumoluhle_Ncube_Resume.pdf',
  )

  const downloadLink = page.getByRole('link', { name: 'Download PDF' })
  await expect(downloadLink).toHaveAttribute(
    'href',
    '/resume/Frank_Dumoluhle_Ncube_Resume.pdf',
  )
  await expect(downloadLink).toHaveAttribute(
    'download',
    'Frank_Dumoluhle_Ncube_Resume.pdf',
  )

  const embeddedViewer = page.locator('object[type="application/pdf"]')
  await expect(embeddedViewer).toHaveAttribute(
    'data',
    '/resume/Frank_Dumoluhle_Ncube_Resume.pdf',
  )
  await expect(embeddedViewer).toHaveAttribute('title', /resume/i)

  await expect(
    page.getByRole('link', { name: /GitHub/i }),
  ).toHaveAttribute(
    'href',
    'https://github.com/Knarf24',
  )

  await expect(
    page.getByRole('link', { name: /LinkedIn/i }),
  ).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/frank-ncube-417a52338',
  )

  await expect(
    page.getByRole('link', { name: /Back to homepage/i }),
  ).toHaveAttribute('href', '/')
})

test('resume route falls back to explicit open/download actions on narrow mobile viewports', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/resume')

  await expect(
    page.locator('object[type="application/pdf"]'),
  ).not.toBeVisible()

  await expect(
    page.getByRole('link', { name: 'Open resume PDF' }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Download PDF' }),
  ).toBeVisible()
  await expect(
    page.getByText(/Inline preview isn.t available on this device/i),
  ).toBeVisible()
})
