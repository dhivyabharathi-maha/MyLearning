export default class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel(/email|username/i).first();
    this.passwordInput = page.getByLabel(/password/i).first();
    this.loginButton = page.getByRole('button', { name: /log\s?in|sign\s?in/i });
    this.errorMessage = page.locator('text=/invalid|enter|credential|Invalid/i');
    this.dashboardHeader = page.getByText("Fabric Selection Portal");
this.adminDashboardHeader = page.getByText(/admin portal/i); 
}

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async login(email, password) {
    await this.goto();
    await this.emailInput.fill(email || '');
    await this.passwordInput.fill(password || '');
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage() {
    return await this.errorMessage.first().textContent();
  }

  async isLoggedIn() {
    return await this.dashboardHeader.isVisible().catch(() => false);
  }

  async isLoginButtonVisible() {
    return await this.loginButton.isVisible();
  }
}
