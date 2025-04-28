import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegistrationPage extends BasePage {
  // Registration form locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly ssnInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('input[id="customer.firstName"]');
    this.lastNameInput = page.locator('input[id="customer.lastName"]');
    this.addressInput = page.locator('input[id="customer.address.street"]');
    this.cityInput = page.locator('input[id="customer.address.city"]');
    this.stateInput = page.locator('input[id="customer.address.state"]');
    this.zipCodeInput = page.locator('input[id="customer.address.zipCode"]');
    this.phoneNumberInput = page.locator('input[id="customer.phoneNumber"]');
    this.ssnInput = page.locator('input[id="customer.ssn"]');
    this.usernameInput = page.locator('input[id="customer.username"]');
    this.passwordInput = page.locator('input[id="customer.password"]');
    this.confirmPasswordInput = page.locator('input[id="repeatedPassword"]');
    this.registerButton = page.locator('input[value="Register"]');
    this.successMessage = page.locator('h1.title').filter({ hasText: 'Welcome' });
    this.errorMessage = page.locator('.error');
  }

  /**
   * Navigate to the registration page
   */
  async navigateToRegistrationPage(): Promise<void> {
    await this.navigate('/parabank/register.htm');
  }

  /**
   * Fill registration form
   * @param userData User data for registration
   */
  async fillRegistrationForm(userData: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    ssn: string;
    username: string;
    password: string;
  }): Promise<void> {
    await this.fill(this.firstNameInput, userData.firstName);
    await this.fill(this.lastNameInput, userData.lastName);
    await this.fill(this.addressInput, userData.address);
    await this.fill(this.cityInput, userData.city);
    await this.fill(this.stateInput, userData.state);
    await this.fill(this.zipCodeInput, userData.zipCode);
    await this.fill(this.phoneNumberInput, userData.phoneNumber);
    await this.fill(this.ssnInput, userData.ssn);
    await this.fill(this.usernameInput, userData.username);
    await this.fill(this.passwordInput, userData.password);
    await this.fill(this.confirmPasswordInput, userData.password);
  }

  /**
   * Submit registration form
   */
  async submitRegistrationForm(): Promise<void> {
    await this.click(this.registerButton);
    await this.waitForNavigation();
  }

  /**
   * Register a new user
   * @param userData User data for registration
   */
  async registerUser(userData: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    ssn: string;
    username: string;
    password: string;
  }): Promise<void> {
    await this.fillRegistrationForm(userData);
    await this.submitRegistrationForm();
  }

  /**
   * Verify registration success
   * @param username The username to verify in the success message
   * @returns True if registration was successful
   */
  async verifyRegistrationSuccess(username: string): Promise<boolean> {
    await this.waitForNavigation();
    return await this.successMessage.isVisible() && 
           (await this.successMessage.innerText()).includes(username);
  }
}