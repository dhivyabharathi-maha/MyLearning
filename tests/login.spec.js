import { test, expect } from '../fixtures/baseFixtures.js';
import loginData from '../testData/loginData.json' assert { type: 'json' };
import { captureFailureScreenshot } from '../utils/helpers.js';

test.describe('Login Scenarios', () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await captureFailureScreenshot(page, testInfo);
    }
  });

  test('Verify login with valid architect credentials', async ({ loginPage }) => {
    const user = loginData.validArchitect;
    await loginPage.login(user.email, user.password);
    expect(await loginPage.isLoggedIn()).toBeTruthy();
   await expect(loginPage.adminDashboardHeader).not.toBeVisible();
  });

  test('Verify login with valid admin credentials', async ({ loginPage }) => {
    const user = loginData.validAdmin;
    await loginPage.login(user.email, user.password);
    expect(await loginPage.isLoggedIn()).toBeTruthy();
    expect(await loginPage.adminDashboardHeader.isVisible());
  });

  test('Verify login with invalid credentials', async ({ loginPage }) => {
    const user = loginData.invalidCredentials;
    await loginPage.login(user.email, user.password);
    expect(await loginPage.getErrorMessage()).toMatch(/invalid|credential|error/i);
  });

  test('Verify login with empty credentials', async ({ loginPage }) => {
    await loginPage.login('', '');
    expect(await loginPage.getErrorMessage()).toMatch(/required|enter|invalid/i);
    expect(await loginPage.isLoginButtonVisible()).toBeTruthy();
  });
});
