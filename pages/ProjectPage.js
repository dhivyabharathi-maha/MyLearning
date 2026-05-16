import { expect } from "@playwright/test";

export default class ProjectPage {
  
  constructor(page) {
    
    this.page = page;
    this.projectNameInput = page.getByLabel(/project name/i).first();
    this.emailInput = page.getByLabel(/email/i).first();
    this.clientInput = page.getByLabel(/client|customer/i).first();
    this.phoneInput = page.getByLabel(/phone|mobile|contact/i).first();
    this.projectType = page.locator('select').first();
    this.saveButton = page.getByRole('button', { name: /save|Add|submit/i }).first();
    this.successToast = page.locator('text=/successfully|saved|created/i');
     this.projectStatusBadge = page.locator('span[data-slot="badge"]').nth(1);
    
    this.projectOpenState = page.locator('text=/open|active/i');
    this.roomCount = page.locator('[class*="room"], text=/room/i');
   
    // Room specific locators
    this.mainRoomCount = page.locator('text=/main/i');
    this.sheerRoomCount = page.locator('text=/sheer/i');
    this.headboardRoomCount = page.locator('text=/headboard/i');
    this.sopaCount = page.locator('[class*="sopa"], text=/sopa/i');
    this.searchInput = page.getByPlaceholder(/search|project name/i).first();
    // Appointment and action icons
    this.appointmentDate = page.locator('[class*="appt"], [class*="appointment"], text=/date/i');
    this.scheduleAppointmentIcon = page.locator('button[title*="schedule"], button[aria-label*="schedule"], [class*="schedule-icon"]');
    this.editProjectIcon = page.locator('button[title*="edit"], button[aria-label*="edit"], [class*="edit-icon"]');
    this.deleteIcon = page.locator('button[title*="delete"], button[aria-label*="delete"], [class*="delete-icon"]');
  }
   
  async createProject(project) {
    console.log('Creating project:', project);
    await this.projectNameInput.fill(project.name);
    if (project.email) await this.emailInput.fill(project.email);
    if (project.client) await this.clientInput.fill(project.client);
    if (project.phone) await this.phoneInput.fill(project.phone);
    if (project.projectType) {
      // Handle combobox project type selection
      console.log('Selecting project type:', project.projectType);
     // await this.projectType.click();
      await this.page.waitForTimeout(500);
      await this.projectType.selectOption({ label: project.projectType });
    }
    // if (project.startDate) await this.startDateInput.fill(project.startDate);
    console.log('Clicking save button');
    await this.saveButton.click();
    
    // Wait for either success toast or error
    try {
      await this.successToast.first().waitFor({ state: 'visible', timeout: 10000 });
      console.log('Success toast appeared');
    } catch (e) {
      console.log('Success toast did not appear, checking for errors...');
      // Check if there are any error messages
      const errorText = await this.page.locator('text=/error|invalid|required/i').allTextContents();
      console.log('Error messages found:', errorText);
      throw e;
    }
    await this.page.getByRole('link', { name: 'Projects' }).click();
  }

  async getSuccessMessage() {
    return await this.successToast.first().textContent();
  }

  // MCP Playwright Server - Check project is in open state
  async verifyProjectIsOpen(projectName) {
  try {

    const projectRow = this.page.locator(`text=${projectName}`).first();

    await projectRow.waitFor({
      state: 'visible',
      timeout: 5000
    });

    const isOpenState =
      await this.page.getByText('Open').first().isVisible();

    return isOpenState;

  } catch (error) {

    console.error(`Failed to verify project open state: ${error.message}`);

    return false;
  }
}

  // MCP Playwright Server - Get room count for the project
  async getRoomCount(projectName) {
    try {
      const projectRow = this.page.locator(`text=${projectName}`).first();
      await projectRow.waitFor({ state: 'visible', timeout: 5000 });
      
      const roomCount = await this.page.evaluate(() => {
        const roomElement = document.querySelector('[class*="room"]');
        if (!roomElement) return 0;
        const roomText = roomElement.textContent;
        const matches = roomText.match(/\d+/);
        return matches ? parseInt(matches[0]) : 0;
      });
      
      return roomCount;
    } catch (error) {
      console.error(`Failed to get room count: ${error.message}`);
      return 0;
    }
  }

  
  // MCP Playwright Server - Get individual room counts (main, sheer, headboard)
  async getIndividualRoomCounts(projectName) {
    try {
      const projectRow = this.page.locator(`text=${projectName}`).first();
      await projectRow.waitFor({ state: 'visible', timeout: 5000 });
      
      const roomCounts = await this.page.evaluate(() => {
        const getText = (selector) => {
          const elem = document.querySelector(selector);
          return elem ? elem.textContent : '';
        };
        
        const extractNumber = (text) => {
          const matches = text.match(/\d+/);
          return matches ? parseInt(matches[0]) : 0;
        };
        
        return {
          main: extractNumber(getText('[class*="main"]') || ''),
          sheer: extractNumber(getText('[class*="sheer"]') || ''),
          headboard: extractNumber(getText('[class*="headboard"]') || '')
        };
      });
      
      return roomCounts;
    } catch (error) {
      console.error(`Failed to get individual room counts: ${error.message}`);
      return { main: 0, sheer: 0, headboard: 0 };
    }
  }

  // MCP Playwright Server - Verify sopa count is zero initially
  async verifySopaCountIsZero(projectName) {
    try {
      const projectRow = this.page.locator(`text=${projectName}`).first();
      await projectRow.waitFor({ state: 'visible', timeout: 5000 });
      
      const sopaCount = await this.page.evaluate(() => {
        const sopaElement = document.querySelector('[class*="sopa"]');
        if (!sopaElement) return 0;
        const sopaText = sopaElement.textContent;
        const matches = sopaText.match(/\d+/);
        return matches ? parseInt(matches[0]) : 0;
      });
      
      return sopaCount === 0;
    } catch (error) {
      console.error(`Failed to verify sopa count: ${error.message}`);
      return false;
    }
  }

  // MCP Playwright Server - Get appointment date
  async getAppointmentDate(projectName) {
    try {
      const projectRow = this.page.locator(`text=${projectName}`).first();
      await projectRow.waitFor({ state: 'visible', timeout: 5000 });
      
      const apptDate = await this.page.evaluate(() => {
        const apptElement = document.querySelector('[class*="appt"], [class*="appointment"], [class*="date"]');
        return apptElement ? apptElement.textContent.trim() : null;
      });
      
      return apptDate;
    } catch (error) {
      console.error(`Failed to get appointment date: ${error.message}`);
      return null;
    }
  }

  // MCP Playwright Server - Verify action icons presence (schedule, edit, delete)
async verifyActionIconsPresence(projectName) {
 

  await expect(
    this.page.getByRole('button', {
      name: 'Schedule Appointment'
    })
  ).toBeVisible();

  await expect(
    this.page.getByRole('button', {
      name: 'Edit Project'
    })
  ).toBeVisible();

  await expect(
    this.page.getByRole('button', {
      name: 'Delete Project'
    })
  ).toBeVisible();

  return true;

  } 

  //icon not present
  async verifyActionIconsNotPresence(projectName) {
 

  await expect(
    this.page.getByRole('button', {
      name: 'Schedule Appointment'
    })
  ).not.toBeVisible();

  await expect(
    this.page.getByRole('button', {
      name: 'Edit Project'
    })
  ).not.toBeVisible();

  await expect(
    this.page.getByRole('button', {
      name: 'Delete Project'
    })
  ).not.toBeVisible();

  return true;

  } 

  // MCP Playwright Server - Complete project verification (all checks)
  async completeProjectVerification(projectName, projectType) {
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('link', { name: 'Projects' }).click();
    if (await this.searchInput.isVisible().catch(() => false)) {
      await this.searchInput.fill(projectName);
      await this.page.keyboard.press('Enter');
    }
    await this.page.waitForTimeout(1000);
await this.page.getByRole('button', { name: 'Collapse Sidebar' }).click();
 const enteredProjectType = this.page.locator('span', {
    hasText: projectType
}).first();
await expect(enteredProjectType).toBeVisible();
    const isOpen = await this.verifyProjectIsOpen(projectName);
    const roomCounts = await this.getIndividualRoomCounts(projectName);
    const sopaIsZero = await this.verifySopaCountIsZero(projectName);
    const apptDate = await this.getAppointmentDate(projectName);
    const actionIcons = await this.verifyActionIconsPresence(projectName);
    const roomCount=await this.getRoomCount(projectName);
   
    const result = {
      projectName,
      isOpen,roomCount,
      roomCounts: {
        main: roomCounts.main,
        sheer: roomCounts.sheer,
        headboard: roomCounts.headboard
      },
      sopaCountIsZero: sopaIsZero,
      appointmentDate: apptDate,
      actionIcons,
      allValidated: isOpen && sopaIsZero && actionIcons.scheduleAppointmentIcon && actionIcons.editProjectIcon && actionIcons.deleteIcon
    };
    
    console.log(`Complete Project Verification: ${JSON.stringify(result)}`);
    return result;
  }

  //verification from admin side
  async completeProjectVerificationInAdmin(projectName, projectType,projectStatusText) {
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('link', { name: 'Projects' }).click();
    if (await this.searchInput.isVisible().catch(() => false)) {
      await this.searchInput.fill(projectName);
      await this.page.keyboard.press('Enter');
    }
    await this.page.waitForTimeout(1000);
await this.page.getByRole('button', { name: 'Collapse Sidebar' }).click();
 const enteredProjectType = this.page.locator('span', {
    hasText: projectType
}).first();
await expect(enteredProjectType).toBeVisible();
    const isOpen = await this.verifyProjectIsOpen(projectName);
    const roomCounts = await this.getIndividualRoomCounts(projectName);
    const sopaIsZero = await this.verifySopaCountIsZero(projectName);
    const apptDate = await this.getAppointmentDate(projectName);
    const actionIcons = await this.verifyActionIconsNotPresence(projectName);
    const roomCount=await this.getRoomCount(projectName);
   const projectStatus = await this.page.getByText(projectStatusText, { exact: true }).first();
   await expect(projectStatus).toBeVisible();
    const result = {
      projectName,
      isOpen,roomCount,
      roomCounts: {
        main: roomCounts.main,
        sheer: roomCounts.sheer,
        headboard: roomCounts.headboard
      },
      enteredProjectType: await enteredProjectType.textContent(),
      sopaCountIsZero: sopaIsZero,
      appointmentDate: apptDate,
      actionIcons,
      allValidated: isOpen && sopaIsZero && actionIcons.scheduleAppointmentIcon && actionIcons.editProjectIcon && actionIcons.deleteIcon
    };
    
    console.log(`Complete Project in admin Page Verification: ${JSON.stringify(result)}`);
    return result;
  }
}


