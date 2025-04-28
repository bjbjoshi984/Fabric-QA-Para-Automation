import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Navigation menu locators
  readonly openNewAccountLink: Locator;
  readonly accountsOverviewLink: Locator;
  readonly transferFundsLink: Locator;
  readonly billPayLink: Locator;
  readonly findTransactionsLink: Locator;
  readonly updateContactInfoLink: Locator;
  readonly requestLoanLink: Locator;
  readonly logoutLink: Locator;
  
  // Welcome message
  readonly welcomeMessage: Locator;
  readonly accountsOverviewTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.openNewAccountLink = page.getByRole('link', { name: 'Open New Account' });
    this.accountsOverviewLink = page.getByRole('link', { name: 'Accounts Overview' });
    this.transferFundsLink = page.getByRole('link', { name: 'Transfer Funds' });
    this.billPayLink = page.getByRole('link', { name: 'Bill Pay' });
    this.findTransactionsLink = page.getByRole('link', { name: 'Find Transactions' });
    this.updateContactInfoLink = page.getByRole('link', { name: 'Update Contact Info' });
    this.requestLoanLink = page.getByRole('link', { name: 'Request Loan' });
    this.logoutLink = page.getByRole('link', { name: 'Log Out' });
    this.welcomeMessage = page.locator('h1.title');
    this.accountsOverviewTitle = page.locator('h1.title').filter({ hasText: 'Accounts Overview' });
  }

  /**
   * Navigate to the home page
   */
  async navigateToHomePage(): Promise<void> {
    await this.navigate('/parabank/index.htm');
  }

  /**
   * Verify the welcome message contains the username
   * @param username The username to verify in the welcome message
   */
  async verifyWelcomeMessage(username: string): Promise<void> {
    await this.assertElementHasText(this.welcomeMessage, `Welcome ${username}`);
  }

  /**
   * Navigate to the open new account page
   */
  async navigateToOpenNewAccount(): Promise<void> {
    await this.click(this.openNewAccountLink);
    await this.waitForNavigation();
  }

  /**
   * Navigate to accounts overview
   */
  async navigateToAccountsOverview(): Promise<void> {
    await this.click(this.accountsOverviewLink);
    await this.waitForNavigation();
  }

  /**
   * Navigate to transfer funds
   */
  async navigateToTransferFunds(): Promise<void> {
    await this.click(this.transferFundsLink);
    await this.waitForNavigation();
  }

  /**
   * Navigate to bill pay
   */
  async navigateToBillPay(): Promise<void> {
    await this.click(this.billPayLink);
    await this.waitForNavigation();
  }

  /**
   * Navigate to find transactions
   */
  async navigateToFindTransactions(): Promise<void> {
    await this.click(this.findTransactionsLink);
    await this.waitForNavigation();
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.click(this.logoutLink);
    await this.waitForNavigation();
  }

  /**
   * Verify all navigation menu items are visible
   */
  async verifyNavigationMenuIsVisible(): Promise<void> {
    await this.assertElementIsVisible(this.openNewAccountLink);
    await this.assertElementIsVisible(this.accountsOverviewLink);
    await this.assertElementIsVisible(this.transferFundsLink);
    await this.assertElementIsVisible(this.billPayLink);
    await this.assertElementIsVisible(this.findTransactionsLink);
    await this.assertElementIsVisible(this.updateContactInfoLink);
    await this.assertElementIsVisible(this.requestLoanLink);
    await this.assertElementIsVisible(this.logoutLink);
  }
}