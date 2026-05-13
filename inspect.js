const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://fabric.symphonyfurnishings.com/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  const root = await page.locator('#root').innerHTML();
  console.log(root.slice(0,8000));
  await browser.close();
})();
