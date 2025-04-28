import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountsOverviewPage extends BasePage {
  // Accounts overview locators
  readonly accountsTable: Locator;
  readonly accountRows: Locator;
  readonly accountBalanceTotal: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.accountsTable = page.locator('#accountTable');
    this.accountRows = page.locator('#accountTable tbody tr');
    this.accountBalanceTotal = page.locator('b').filter({ hasText: '$' }).first();
    this.pageTitle = page.locator('h1.title').filter({ hasText: 'Accounts Overview' });
  }

  /**
   * Navigate to the accounts overview page
   */
  async navigateToAccountsOverview(): Promise<void> {
    await this.navigate('/parabank/overview.htm');
    await this.waitForNavigation();
  }

  /**
   * Get account details by account number
   * @param accountNumber The account number to find
   * @returns The account details (balance, available amount)
   */
  async getAccountDetails(accountNumber: string): Promise<{ accountNumber: string; balance: string; availableAmount: string } | null> {
    const rows = await this.accountRows.all();
    
    for (const row of rows) {
      const cells = await row.locator('td').all();
      const rowAccountNumber = await cells[0].innerText();
      
      if (rowAccountNumber === accountNumber) {
        return {
          accountNumber: rowAccountNumber,
          balance: await cells[1].innerText(),
          availableAmount: await cells[2].innerText()
        };
      }
    }
    
    return null;
  }

  /**
   * Get all account numbers
   * @returns Array of account numbers
   */
  async getAllAccountNumbers(): Promise<string[]> {
    const accountNumbers: string[] = [];
    const rows = await this.accountRows.all();
    
    for (const row of rows) {
      const cells = await row.locator('td').all();
      accountNumbers.push(await cells[0].innerText());
    }
    
    return accountNumbers;
  }

  /**
   * Get total balance
   * @returns The total balance
   */
  async getTotalBalance(): Promise<string> {
    return await this.getElementText(this.accountBalanceTotal);
  }

  /**
   * Verify accounts overview page is displayed
   */
  async verifyAccountsOverviewPageIsDisplayed(): Promise<void> {
    await this.assertElementIsVisible(this.pageTitle);
    await this.assertElementIsVisible(this.accountsTable);
  }
}