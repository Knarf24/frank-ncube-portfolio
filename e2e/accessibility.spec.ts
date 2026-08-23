import { expect, test } from "@playwright/test";

test("hero is readable with reduced motion enabled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Frank Ncube" }),
  ).toBeVisible();
  await expect(
    page.getByText(/Computer Information Sciences student/i),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Portrait of Frank Ncube" }),
  ).toBeVisible();
});

test("narrow hero gives the primary call to action its own row", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const [primary, github, resume] = await page.locator("main").evaluate(
    (main) => {
      const links = Array.from(main.querySelectorAll("a"));
      const getBox = (label: string) => {
        const link = links.find((item) => item.textContent?.trim() === label);

        if (!link) return null;

        const { x, y, width, height } = link.getBoundingClientRect();
        return { x, y, width, height };
      };

      return [getBox("View my work"), getBox("GitHub"), getBox("Resume")];
    },
  );

  expect(primary).not.toBeNull();
  expect(github).not.toBeNull();
  expect(resume).not.toBeNull();
  expect(primary!.y).toBeLessThan(github!.y);
  expect(github!.y).toBe(resume!.y);
  expect(primary!.height).toBeGreaterThanOrEqual(44);
  expect(github!.height).toBeGreaterThanOrEqual(44);
  expect(resume!.height).toBeGreaterThanOrEqual(44);
});

test("narrow profile metadata wraps without slash separators", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");

  const hero = page.locator("main > section").first();
  const college = hero.getByText("Livingstone College", { exact: true });
  const classYear = hero.getByText("Class of 2029", { exact: true });
  const focus = hero.getByText("Software · AI · Cloud", { exact: true });
  const [collegeBox, classYearBox, focusBox] = await Promise.all([
    college.boundingBox(),
    classYear.boundingBox(),
    focus.boundingBox(),
  ]);

  expect(collegeBox).not.toBeNull();
  expect(classYearBox).not.toBeNull();
  expect(focusBox).not.toBeNull();
  expect(collegeBox!.y).toBe(classYearBox!.y);
  expect(focusBox!.y).toBeGreaterThan(collegeBox!.y);
  await expect
    .poll(() =>
      college.evaluate(
        (element) => getComputedStyle(element, "::after").display,
      ),
    )
    .toBe("none");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBe(320);
});

test("mobile hero keeps the complete portrait within the first viewport", async ({
  page,
}) => {
  const viewports = [
    { width: 320, height: 900 },
    { width: 390, height: 844 },
  ];

  for (const { width, height } of viewports) {
    await page.setViewportSize({ width, height });
    await page.goto("/");

    const portrait = await page
      .getByRole("img", { name: "Portrait of Frank Ncube" })
      .boundingBox();

    expect(portrait).not.toBeNull();
    expect(portrait!.height).toBeGreaterThan(150);
    expect(portrait!.height).toBeLessThan(400);
    expect(portrait!.y + portrait!.height).toBeLessThanOrEqual(height);
  }
});

test("primary actions are keyboard reachable", async ({
  page,
  browserName,
}) => {
  // WebKit's default Tab order excludes links (it only includes them once
  // the OS-level "Full Keyboard Access" preference is on, matching real
  // Safari's default and not something a page can control). Chromium and
  // Firefox both tab through links by default, so this verifies the
  // interaction on the engines where it reflects a real user's Tab order.
  test.skip(
    browserName === "webkit",
    "WebKit excludes links from the default Tab order without the OS-level Full Keyboard Access preference enabled",
  );

  await page.goto("/");

  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();

  for (let i = 0; i < 12; i += 1) {
    const text = await page.locator(":focus").textContent();

    if (text?.includes("View my work")) break;

    await page.keyboard.press("Tab");
  }

  await expect(page.locator(":focus")).toContainText("View my work");
});

test("mobile menu toggle is keyboard operable and exposes aria-expanded", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");

  const toggle = page.locator('button[aria-controls="mobile-navigation"]');
  const toggleBox = await toggle.boundingBox();
  expect(toggleBox!.height).toBeGreaterThanOrEqual(44);
  expect(toggleBox!.width).toBeGreaterThanOrEqual(44);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");

  const nav = page.locator("#mobile-navigation");
  await expect(nav).toBeVisible();

  const workLink = nav.getByRole("link", { name: "Work", exact: true });
  const linkBox = await workLink.boundingBox();
  expect(linkBox!.height).toBeGreaterThanOrEqual(44);

  await workLink.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(nav).not.toBeVisible();
});

test("hero portrait exposes meaningful alt text and is not hidden from assistive tech", async ({
  page,
}) => {
  await page.goto("/");

  const portrait = page.getByRole("img", { name: "Portrait of Frank Ncube" });
  await expect(portrait).toBeVisible();
  await expect(portrait).toHaveAttribute("alt", "Portrait of Frank Ncube");

  const isAriaHidden = await portrait.evaluate(
    (el) => el.closest('[aria-hidden="true"]') !== null,
  );
  expect(isAriaHidden).toBe(false);
});

test("Triage360 architecture flow exposes a complete plain-language label", async ({
  page,
}) => {
  await page.goto("/projects/triage360");

  const flow = page.getByRole("img", {
    name: /Incoming ticket to Classification to Document retrieval to Risk evaluation to AI response to History \/ stats/i,
  });

  await expect(flow).toBeVisible();

  // The full-stack app uses keyword-overlap retrieval, not TF-IDF — only the
  // separate Python prototype implements TF-IDF. The architecture-flow stage
  // must not claim otherwise.
  const flowLabel = await flow.getAttribute("aria-label");
  expect(flowLabel).not.toMatch(/TF-IDF/i);
});

test("reduced motion keeps revealed sections immediately visible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const contact = page.locator("#contact");
  await contact.scrollIntoViewIfNeeded();
  await expect(contact).toBeVisible();

  const opacity = await contact.evaluate(
    (el) => getComputedStyle(el).opacity,
  );
  expect(Number(opacity)).toBeGreaterThan(0.9);
});

test("Livingstone College logo stays decorative beside the visible institution name", async ({
  page,
}) => {
  await page.goto("/");

  const logos = page.locator('img[src*="livingstone-college"]');
  await expect(logos).toHaveCount(2);

  const count = await logos.count();
  for (let i = 0; i < count; i += 1) {
    await expect(logos.nth(i)).toHaveAttribute("alt", "");
  }

  const educationSection = page.locator("section", {
    has: page.getByRole("heading", { name: "Education & achievements" }),
  });
  await expect(
    educationSection.getByText("Livingstone College", { exact: true }),
  ).toBeVisible();
});

test("technical toolkit marquee keeps technology names accessible and hides the decorative visual", async ({
  page,
}) => {
  await page.goto("/");

  const toolkitSection = page.locator("section", {
    has: page.getByRole("heading", { name: "Tools I build with" }),
  });

  await expect(
    toolkitSection.getByText("Python", { exact: true }),
  ).toBeAttached();
  await expect(
    toolkitSection.getByText("PostgreSQL", { exact: true }),
  ).toBeAttached();

  const marquee = toolkitSection.locator('[aria-hidden="true"]').first();
  await expect(marquee).toHaveAttribute("aria-hidden", "true");
});

test("technical toolkit keeps non-logo skills visible and recruiter-readable", async ({
  page,
}) => {
  await page.goto("/");

  const toolkitSection = page.locator("section", {
    has: page.getByRole("heading", { name: "Tools I build with" }),
  });

  const additionalSkills = toolkitSection.getByText("Additional tools", {
    exact: false,
  });
  await expect(additionalSkills).toBeVisible();

  for (const skill of [
    "AWS",
    "VS Code",
    "REST APIs",
    "LLM integration",
    "TF-IDF",
  ]) {
    await expect(toolkitSection.getByText(skill)).toBeVisible();
  }
});

test("reduced motion swaps the technical toolkit marquee for a static grid", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const toolkitSection = page.locator("section", {
    has: page.getByRole("heading", { name: "Tools I build with" }),
  });

  const decorativeLayers = toolkitSection.locator('[aria-hidden="true"]');
  const marqueeDisplay = await decorativeLayers
    .first()
    .evaluate((el) => getComputedStyle(el).display);
  expect(marqueeDisplay).toBe("none");

  const staticGridDisplay = await decorativeLayers
    .nth(1)
    .evaluate((el) => getComputedStyle(el).display);
  expect(staticGridDisplay).not.toBe("none");
});

test("project archive filter buttons meet the 44px touch-target minimum", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/projects");

  const buttons = page
    .getByRole("group", { name: /filter projects by category/i })
    .getByRole("button");
  const count = await buttons.count();

  for (let i = 0; i < count; i += 1) {
    const box = await buttons.nth(i).boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});
