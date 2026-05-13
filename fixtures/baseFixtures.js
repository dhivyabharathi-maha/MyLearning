import { test as base, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import DashboardPage from '../pages/DashboardPage.js';
import ProjectPage from '../pages/ProjectPage.js';
import AdminProjectPage from '../pages/AdminProjectPage.js';

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  projectPage: async ({ page }, use) => {
    await use(new ProjectPage(page));
  },

  adminProjectPage: async ({ page }, use) => {
    await use(new AdminProjectPage(page));
  },
});

export { expect };
