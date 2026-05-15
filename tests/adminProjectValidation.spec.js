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
 

    // Create a new project as architect first, then validate as admin.
    await loginPage.login(architect.email, architect.password);
    await dashboardPage.navigateToNewProject();
    const newProjectName = getRandomProjectName('ArchitectProject');
    await projectPage.createProject({
      name: newProjectName,
      description: projectData.adminValidationProject.description,
      client: projectData.adminValidationProject.client,
      projectType: projectData.defaultProject.projectType
    });
    expect(await projectPage.getSuccessMessage()).toMatch(/successfully|saved|created/i);
    await dashboardPage.logout();

    await loginPage.login(admin.email, admin.password);
    await adminProjectPage.gotoAllProjects();
    await adminProjectPage.searchProject(newProjectName);

    expect(await adminProjectPage.isProjectVisible(newProjectName)).toBeTruthy();
await this.page.getByRole('button', { name: 'Collapse Sidebar' }).click();
    const validation = await adminProjectPage.verifyAdminProjectFromArchitect(newProjectName, {
      projectType: projectData.defaultProject.projectType,
      roomCount: 0
    });

    expect(validation.allValid).toBeTruthy();
    expect(validation.details.projectType).toContain(projectData.defaultProject.projectType);
    expect(validation.details.roomCount).toBe(0);
    expect(validation.details.mainCount).toBe(0);
    expect(validation.details.sheerCount).toBe(0);
    expect(validation.details.headboardCount).toBe(0);
    expect(validation.details.sopaCount).toBe(0);
    expect(validation.details.appointmentInfo).toBeTruthy();
    expect(validation.details.isOpen).toBeTruthy();
    expect(validation.details.projectStatus).toMatch(/in progress/i);
    expect(validation.details.hasQuickActionIcon).toBeFalsy();
  });

  // test('Admin creates project and validates visibility, counts, status, and quick actions', async ({ loginPage, projectPage, adminProjectPage }) => {
  //   const projectName = getRandomProjectName('AdminCreatedProject');

  //   await loginPage.login('dhoni@yopmail.com', 'Admin@123');
  //   await adminProjectPage.gotoAllProjects();
    
  //   // Click Add Project button on the projects page
  //   await adminProjectPage.page.getByRole('button', { name: /Add Project/i }).click();
    
  //   await projectPage.createProject({
  //     name: projectName,
  //     client: 'client 1',
  //     email: 'client1@email.com',
  //     phone: '8888888888',
  //     projectType: 'Hospital'
  //   });

  //   // Check if success message appears
  //   const successMessage = await projectPage.getSuccessMessage().catch(() => null);
  //   console.log('Success message:', successMessage);
  //   expect(successMessage).toMatch(/successfully|saved|created/i);
    
  //   // Wait a bit and refresh the page to see if project appears
  //   await adminProjectPage.page.waitForTimeout(2000);
  //   await adminProjectPage.page.reload();
  //   await adminProjectPage.page.waitForLoadState('networkidle');

  //   await adminProjectPage.gotoAllProjects();
  //   await adminProjectPage.searchProject(projectName);

  //   expect(await adminProjectPage.isProjectVisible(projectName)).toBeTruthy();

  //   const validation = await adminProjectPage.verifyAdminProjectFromArchitect(projectName, {
  //     projectType: 'Hospital',
  //     roomCount: 0,
  //     appointmentNotRequested: true,
  //     quickActions: {
  //       edit: true,
  //       schedule: true,
  //       delete: true
  //     }
  //   });

  //   expect(validation.allValid).toBeTruthy();
  //   expect(validation.details.projectType).toContain(projectData.defaultProject.projectType);
  //   expect(validation.details.roomCount).toBe(0);
  //   expect(validation.details.mainCount).toBe(0);
  //   expect(validation.details.sheerCount).toBe(0);
  //   expect(validation.details.headboardCount).toBe(0);
  //   expect(validation.details.sopaCount).toBe(0);
  //   expect(validation.details.appointmentInfo).toMatch(/not requested/i);
  //   expect(validation.details.isOpen).toBeTruthy();
  //   expect(validation.details.projectStatus).toMatch(/in progress/i);
  //   expect(validation.details.hasEditIcon).toBeTruthy();
  //   expect(validation.details.hasScheduleIcon).toBeTruthy();
  //   expect(validation.details.hasDeleteIcon).toBeTruthy();
  // });
});
