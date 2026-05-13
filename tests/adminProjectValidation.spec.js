import { test, expect } from '../fixtures/baseFixtures.js';
import loginData from '../testData/loginData.json' assert { type: 'json' };
import projectData from '../testData/projectData.json' assert { type: 'json' };
import { getRandomProjectName } from '../utils/randomData.js';
import { captureFailureScreenshot } from '../utils/helpers.js';

// This test validates that a project created by the architect is visible to admin users.
test.describe('Admin Project Validation', () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await captureFailureScreenshot(page, testInfo);
    }
  });

  test('Verify architect-created project is visible in admin All Projects', async ({ loginPage, dashboardPage, projectPage, adminProjectPage }) => {
    const architect = loginData.validArchitect;
    const admin = loginData.validAdmin;
    const projectName = getRandomProjectName('AdminValidationProject');

    // Create a new project as architect first, then validate as admin.
    await loginPage.login(architect.email, architect.password);
    await dashboardPage.navigateToNewProject();
    await projectPage.createProject({
      name: projectName,
      description: projectData.adminValidationProject.description,
      client: projectData.adminValidationProject.client,
      startDate: projectData.adminValidationProject.startDate,
    });
    expect(await projectPage.getSuccessMessage()).toMatch(/successfully|saved|created/i);
    await dashboardPage.logout();

    await loginPage.login(admin.email, admin.password);
    await adminProjectPage.gotoAllProjects();
    await adminProjectPage.searchProject(projectName);

    expect(await adminProjectPage.isProjectVisible(projectName)).toBeTruthy();
    const rowText = await adminProjectPage.getProjectRowText(projectName);
    expect(rowText).toContain(projectName);
    expect(rowText).toMatch(/Project|Client|Status|Architect/i);
  });
});
