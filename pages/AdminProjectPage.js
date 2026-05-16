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



  

  
}
