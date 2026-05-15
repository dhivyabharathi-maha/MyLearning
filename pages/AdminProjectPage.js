export default class AdminProjectPage {
  constructor(page) {
    this.page = page;
    this.allProjectsNav = page.getByRole('link', { name: /all projects|projects/i }).first();
    this.searchInput = page.getByPlaceholder(/search|project name/i).first();
    this.projectRow = (projectName) => page.locator(`text=${projectName}`).first().locator('..');
  }

  async gotoAllProjects() {
    await this.allProjectsNav.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchProject(projectName) {
    if (await this.searchInput.isVisible().catch(() => false)) {
      await this.searchInput.fill(projectName);
      await this.page.keyboard.press('Enter');
    }
    await this.page.waitForTimeout(1000);
  }

  async isProjectVisible(projectName) {
    return await this.page.getByText(projectName).first().isVisible().catch(() => false);
  }

  async getProjectRowText(projectName) {
    return await this.projectRow(projectName).textContent();
  }

  async _getAdminProjectRow(projectName) {
    const projectText = this.page.getByText(projectName).first();
    await projectText.waitFor({ state: 'visible', timeout: 5000 });
    return projectText;
  }

  async getAdminProjectDetails(projectName) {
    try {
       const projectText = await this._getAdminProjectRow(projectName);
  
       return await projectText.evaluate((node) => {
  const row =
    node.closest('tr, .project-row, .row, .list-item, .ant-table-row') ||
    node.parentElement;

  const firstInRow = (selector) =>
    row ? row.querySelector(selector) : null;

  const textBySelector = (selector) => {
    const element = firstInRow(selector);
    return element ? element.textContent.trim() : null;
  };

  const textByMatch = (regexp) => {
    const match = [...row.querySelectorAll('*')].find(
      (el) => el.textContent && regexp.test(el.textContent)
    );
    return match ? match.textContent.trim() : null;
  };

  const parseNumber = (text) => {
    if (!text) return 0;

    const match = text.match(/\d+/);

    return match ? parseInt(match[0], 10) : 0;
  };

  const projectTypeText =
    textBySelector(
      '[data-testid*="project-type"], [class*="project-type"], [class*="type"], [aria-label*="project type"]'
    ) || textByMatch(/project type|type/i);

  const appointmentText =
    textBySelector(
      '[data-testid*="appointment"], [class*="appointment"], [class*="appt"], [aria-label*="appointment"]'
    ) || textByMatch(/appointment|appt|date/i);

  const statusText =
    textBySelector(
      '[data-testid*="status"], [class*="status"], [aria-label*="status"]'
    ) || textByMatch(/in progress|open|active|pending|completed/i);

  const roomText =
    textBySelector(
      '[data-testid*="room-count"], [class*="room"], [aria-label*="room count"]'
    ) || textByMatch(/rooms?|room count|room/i);

  const mainText =
    textBySelector(
      '[data-testid*="main"], [class*="main"], [aria-label*="main"]'
    ) || textByMatch(/main/i);

  const sheerText =
    textBySelector(
      '[data-testid*="sheer"], [class*="sheer"], [aria-label*="sheer"]'
    ) || textByMatch(/sheer/i);

  const headboardText =
    textBySelector(
      '[data-testid*="headboard"], [class*="headboard"], [aria-label*="headboard"]'
    ) || textByMatch(/headboard/i);

  const sopaText =
    textBySelector(
      '[data-testid*="sopa"], [class*="sopa"], [aria-label*="sopa"]'
    ) || textByMatch(/sopa/i);

  const editIcon = row.querySelector(
    'button[title*="edit"], button[aria-label*="edit"], [class*="edit-icon"]'
  );

  const scheduleIcon = row.querySelector(
    'button[title*="schedule"], button[aria-label*="schedule"], [class*="schedule-icon"]'
  );

  const deleteIcon = row.querySelector(
    'button[title*="delete"], button[aria-label*="delete"], [class*="delete-icon"]'
  );

  return {
    visible: true,
    projectType: projectTypeText,
    roomCount: parseNumber(roomText),
    mainCount: parseNumber(mainText),
    sheerCount: parseNumber(sheerText),
    headboardCount: parseNumber(headboardText),
    sopaCount: parseNumber(sopaText),
    appointmentInfo: appointmentText,
    projectStatus: statusText,
    isOpen: statusText ? /open/i.test(statusText) : false,
    hasEditIcon: !!editIcon,
    hasScheduleIcon: !!scheduleIcon,
    hasDeleteIcon: !!deleteIcon,
    hasQuickActionIcon: !!(
      editIcon ||
      scheduleIcon ||
      deleteIcon
    )
  };
});
     }
      catch (error) {
        console.error(`Failed to get admin project details: ${error.message}`);
        return null;
      }
  }

  async verifyAdminProjectFromArchitect(projectName, expected) {
    const details = await this.getAdminProjectDetails(projectName);
    const matches = {
      visible: details.visible,
      projectTypeMatches: expected.projectType ? details.projectType?.toLowerCase().includes(expected.projectType.toLowerCase()) : true,
      roomCountMatches: expected.roomCount == null ? true : details.roomCount === expected.roomCount,
      mainCountZero: details.mainCount === 0,
      sheerCountZero: details.sheerCount === 0,
      headboardCountZero: details.headboardCount === 0,
      sopaCountZero: details.sopaCount === 0,
      appointmentNotRequested: expected.appointmentNotRequested == null ? true : details.appointmentInfo ? /not requested/i.test(details.appointmentInfo) : false,
      openStatus: details.isOpen,
      projectStatusInProgress: details.projectStatus ? /in progress/i.test(details.projectStatus) : false,
      editActionPresent: expected.quickActions?.edit == null ? true : details.hasEditIcon === expected.quickActions.edit,
      scheduleActionPresent: expected.quickActions?.schedule == null ? true : details.hasScheduleIcon === expected.quickActions.schedule,
      deleteActionPresent: expected.quickActions?.delete == null ? true : details.hasDeleteIcon === expected.quickActions.delete
    };

    return {
      projectName,
      expected,
      details,
      matches,
      allValid: Object.values(matches).every(Boolean)
    };
  }
}
