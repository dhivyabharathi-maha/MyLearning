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

  test('Create new project in architect login and verify added project is integrated with admin login', async ({ loginPage, dashboardPage, projectPage,adminProjectPage }) => {
    const architect = loginData.validArchitect;
    const admin = loginData.validAdmin;
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
  
   
   expect(await projectPage.completeProjectVerification(newProjectName, projectData.defaultProject.projectType)).toBeTruthy(); 
  
     expect(await projectPage.projectStatusBadge.first().textContent()).toMatch(/NOT_REQUESTED/i);
  await dashboardPage.logout();
  await loginPage.login(admin.email, admin.password);
    await adminProjectPage.gotoAllProjects();
    await adminProjectPage.searchProject(newProjectName);
await 
    expect(await adminProjectPage.isProjectVisible(newProjectName)).toBeTruthy();

    expect(await projectPage.completeProjectVerificationInAdmin(newProjectName, projectData.defaultProject.projectType,"In Progress")).toBeTruthy(); 
  
     
    });
});
