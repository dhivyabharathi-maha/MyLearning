import { test, expect } from '../fixtures/baseFixtures.js';
import loginData from '../testData/loginData.json' assert { type: 'json' };
import projectData from '../testData/projectData.json' assert { type: 'json' };
import { getRandomProjectName } from '../utils/randomData.js';
import { captureFailureScreenshot } from '../utils/helpers.js';

test.describe('Architect Project Workflows', () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await captureFailureScreenshot(page, testInfo);
    }
  });

  test('Create new project and verify it appears in architect project list', async ({ loginPage, dashboardPage, projectPage }) => {
    const architect = loginData.validArchitect;
    const newProjectName = getRandomProjectName('ArchitectProject');
    await loginPage.login(architect.email, architect.password);
    await dashboardPage.navigateToNewProject();

    await projectPage.createProject({
      name: newProjectName,
      email: projectData.defaultProject.email,
      client: projectData.defaultProject.client,
    
      projectType: projectData.defaultProject.projectType
    });

    const successMessage = await projectPage.getSuccessMessage();
    expect(successMessage).toMatch(/successfully|saved|created/i);
    expect(await dashboardPage.isProjectPresent(newProjectName)).toBeTruthy();
  });
});
