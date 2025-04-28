import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Login form locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('input[value="Log In"]');
    this.registerLink = page.getByRole('link', { name: 'Register' });
    this.errorMessage = page.locator('.error');
  }

  /**
   * Navigate to the login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.navigate('/parabank/index.htm');
  }

  /**
   * Perform login
   * @param username The username to log in with
   * @param password The password to log in with
   */
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForNavigation();
  }

  /**
   * Navigate to the registration page
   */
  async navigateToRegistration(): Promise<void> {
    await this.click(this.registerLink);
    await this.waitForNavigation();
  }

  /**
   * Check if error message is displayed
   * @returns True if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Get error message text
   * @returns The error message text
   */
  async getErrorMessageText(): Promise<string> {
    return await this.getElementText(this.errorMessage);
  }
}