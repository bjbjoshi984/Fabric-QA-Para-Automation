import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class OpenNewAccountPage extends BasePage {
  // Open new account form locators
  readonly accountTypeDropdown: Locator;
  readonly fromAccountDropdown: Locator;
  readonly openNewAccountButton: Locator;
  readonly accountOpenedTitle: Locator;
  readonly newAccountId: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.accountTypeDropdown = page.locator('#type');
    this.fromAccountDropdown = page.locator('#fromAccountId');
    this.openNewAccountButton = page.locator('input[value="Open New Account"]');
    this.accountOpenedTitle = page.locator('h1.title').filter({ hasText: 'Account Opened!' });
    this.newAccountId = page.locator('#newAccountId');
    this.pageTitle = page.locator('h1.title').filter({ hasText: 'Open New Account' });
  }

  /**
   * Navigate to the open new account page
   */
  async navigateToOpenNewAccount(): Promise<void> {
    await this.navigate('/parabank/openaccount.htm');
    await this.waitForNavigation();
  }

  /**
   * Open a new account
   * @param accountType The type of account to open ('SAVINGS' or 'CHECKING')
   * @param fromAccountId The account ID to transfer funds from
   * @returns The new account ID
   */
  async openNewAccount(accountType: 'SAVINGS' | 'CHECKING', fromAccountId: string): Promise<string> {
    await this.selectOption(this.accountTypeDropdown, accountType);
    await this.page.waitForTimeout(1000); // Wait for the fromAccountId dropdown to update
    await this.selectOption(this.fromAccountDropdown, fromAccountId);
    await this.click(this.openNewAccountButton);
    await this.waitForNavigation();
    
    // Verify account was created
    await this.assertElementIsVisible(this.accountOpenedTitle);
    
    // Get the new account ID
    return await this.getElementText(this.newAccountId);
  }

  /**
   * Verify open new account page is displayed
   */
  async verifyOpenNewAccountPageIsDisplayed(): Promise<void> {
    await this.assertElementIsVisible(this.pageTitle);
    await this.assertElementIsVisible(this.accountTypeDropdown);
    await this.assertElementIsVisible(this.fromAccountDropdown);
    await this.assertElementIsVisible(this.openNewAccountButton);
  }
}