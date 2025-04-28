import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FindTransactionsPage extends BasePage {
  // Find transactions form locators
  readonly accountDropdown: Locator;
  readonly findByDateButton: Locator;
  readonly findByDateRangeButton: Locator;
  readonly findByAmountButton: Locator;
  readonly findByIdButton: Locator;
  readonly dateInput: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly amountInput: Locator;
  readonly transactionIdInput: Locator;
  readonly transactionsTable: Locator;
  readonly transactionRows: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.accountDropdown = page.locator('#accountId');
    this.findByDateButton = page.locator('button[value="Find Transactions"]').filter({ hasText: 'Find Transactions' }).first();
    this.findByDateRangeButton = page.locator('button[value="Find Transactions"]').filter({ hasText: 'Find Transactions' }).nth(1);
    this.findByAmountButton = page.locator('button[value="Find Transactions"]').filter({ hasText: 'Find Transactions' }).nth(2);
    this.findByIdButton = page.locator('button[value="Find Transactions"]').filter({ hasText: 'Find Transactions' }).nth(3);
    this.dateInput = page.locator('#criteria\\.onDate');
    this.fromDateInput = page.locator('#criteria\\.fromDate');
    this.toDateInput = page.locator('#criteria\\.toDate');
    this.amountInput = page.locator('#criteria\\.amount');
    this.transactionIdInput = page.locator('#criteria\\.transactionId');
    this.transactionsTable = page.locator('#transactionTable');
    this.transactionRows = page.locator('#transactionTable tbody tr');
    this.pageTitle = page.locator('h1.title').filter({ hasText: 'Find Transactions' });
  }

  /**
   * Navigate to the find transactions page
   */
  async navigateToFindTransactions(): Promise<void> {
    await this.navigate('/parabank/findtrans.htm');
    await this.waitForNavigation();
  }

  /**
   * Find transactions by amount
   * @param accountId The account ID to search
   * @param amount The transaction amount to search for
   * @returns True if transactions are found
   */
  async findTransactionsByAmount(accountId: string, amount: string): Promise<boolean> {
    await this.selectOption(this.accountDropdown, accountId);
    await this.fill(this.amountInput, amount);
    await this.click(this.findByAmountButton);
    await this.waitForNavigation();
    
    // Verify transactions table is displayed
    return await this.isElementVisible(this.transactionsTable);
  }

  /**
   * Get all transactions
   * @returns Array of transaction details
   */
  async getAllTransactions(): Promise<Array<{ date: string; description: string; amount: string }>> {
    const transactions: Array<{ date: string; description: string; amount: string }> = [];
    const rows = await this.transactionRows.all();
    
    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 3) {
        transactions.push({
          date: await cells[0].innerText(),
          description: await cells[1].innerText(),
          amount: await cells[2].innerText()
        });
      }
    }
    
    return transactions;
  }

  /**
   * Verify find transactions page is displayed
   */
  async verifyFindTransactionsPageIsDisplayed(): Promise<void> {
    await this.assertElementIsVisible(this.pageTitle);
    await this.assertElementIsVisible(this.accountDropdown);
    await this.assertElementIsVisible(this.dateInput);
    await this.assertElementIsVisible(this.amountInput);
    await this.assertElementIsVisible(this.transactionIdInput);
  }
}