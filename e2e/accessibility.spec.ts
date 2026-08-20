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
  await expect(page.getByTestId("animated-globe")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
});

test("globe orbits animate when reduced motion is not requested", async ({
  page,
}) => {
  await page.goto("/");

  const orbit = page
    .getByTestId("animated-globe")
    .locator("svg > g")
    .first();
  const initialTransform = await orbit.evaluate(
    (element) => getComputedStyle(element).transform,
  );

  await expect
    .poll(() =>
      orbit.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(initialTransform);
});

test("narrow hero gives the primary call to action its own row", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByTestId("animated-globe")).toHaveAttribute(
    "data-reduced-motion",
    "false",
  );

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

  const college = page.getByText("Livingstone College", { exact: true });
  const classYear = page.getByText("Class of 2029", { exact: true });
  const focus = page.getByText("Software · AI · Cloud", { exact: true });
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

test("mobile hero keeps the complete globe within the first viewport", async ({
  page,
}) => {
  const viewports = [
    { width: 320, height: 900, globeSize: 280 },
    { width: 390, height: 844, globeSize: 300 },
  ];

  for (const { width, height, globeSize } of viewports) {
    await page.setViewportSize({ width, height });
    await page.goto("/");

    const globe = await page.getByTestId("animated-globe").boundingBox();

    expect(globe).not.toBeNull();
    expect(globe!.height).toBe(globeSize);
    expect(globe!.y + globe!.height).toBeLessThanOrEqual(height);
  }
});
