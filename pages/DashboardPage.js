export default class DashboardPage {
  constructor(page) {
    this.page = page;
    this.createProjectButton = page.getByRole('button', { name: /create|Add project/i });
    this.projectList = page.locator('[data-testid="project-list"], .project-list, table');
    this.profileMenu = page.getByRole('button', { name: /profile|menu|account/i }).first();
    this.logoutOption = page.getByRole('button', { name: /log\s?out|sign\s?out/i }).first();
  }

  async navigateToNewProject() {
    await this.createProjectButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isProjectPresent(projectName) {
    return await this.page.getByText(projectName).first().isVisible().catch(() => false);
  }

  async logout() {
    if (await this.logoutOption.isVisible().catch(() => false)) {
      await this.logoutOption.click();
    } else if (await this.profileMenu.isVisible().catch(() => false)) {
      await this.profileMenu.click();
      await this.page.getByRole('button', { name: /log\s?out|sign\s?out/i }).click();
    }
    await this.page.waitForLoadState('networkidle');
  }
}
