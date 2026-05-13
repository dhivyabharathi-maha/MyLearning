export async function safeClick(locator) {
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  await locator.click();
}

export async function safeFill(locator, value) {
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  await locator.fill(value);
}

export async function safeText(locator) {
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  return await locator.textContent();
}

export async function captureFailureScreenshot(page, testInfo) {
  const fileName = testInfo.title.replace(/[^a-zA-Z0-9_]/g, '_');
  await page.screenshot({ path: `test-results/screenshots/${fileName}.png`, fullPage: true });
}
