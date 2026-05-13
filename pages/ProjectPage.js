export default class ProjectPage {
  constructor(page) {
    this.page = page;
    this.projectNameInput = page.getByLabel(/project name/i).first();
    this.emailInput = page.getByLabel(/email/i).first();
    this.clientInput = page.getByLabel(/client|customer/i).first();
   this.projectType=page.locator('select').first();
    this.saveButton = page.getByRole('button', { name: /save|Add|submit/i }).first();
    this.successToast = page.locator('text=/successfully|saved|created/i');
  }

  async createProject(project) {
    await this.projectNameInput.fill(project.name);
    if (project.email) await this.emailInput.fill(project.email);
    if (project.client) await this.clientInput.fill(project.client);
    if (project.projectType) await this.projectType.selectOption({ label: project.projectType });
    // if (project.startDate) await this.startDateInput.fill(project.startDate);
    await this.saveButton.click();
    await this.successToast.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async getSuccessMessage() {
    return await this.successToast.first().textContent();
  }
}
