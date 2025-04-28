import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TransferFundsPage extends BasePage {
  // Transfer funds form locators
  readonly amountInput: Locator;
  readonly fromAccountDropdown: Locator;
  readonly toAccountDropdown: Locator;
  readonly transferButton: Locator;
  readonly transferCompleteTitle: Locator;
  readonly transferAmount: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.amountInput = page.locator('#amount');
    this.fromAccountDropdown = page.locator('#fromAccountId');
    this.toAccountDropdown = page.locator('#toAccountId');
    this.transferButton = page.locator('input[value="Transfer"]');
    this.transferCompleteTitle = page.locator('h1.title').filter({ hasText: 'Transfer Complete!' });
    this.transferAmount = page.locator('#amount');
    this.pageTitle = page.locator('h1.title').filter({ hasText: 'Transfer Funds' });
  }

  /**
   * Navigate to the transfer funds page
   */
  async navigateToTransferFunds(): Promise<void> {
    await this.navigate('/parabank/transfer.htm');
    await this.waitForNavigation();
  }

  /**
   * Transfer funds between accounts
   * @param amount The amount to transfer
   * @param fromAccountId The account to transfer from
   * @param toAccountId The account to transfer to
   * @returns True if transfer was successful
   */
  async transferFunds(amount: string, fromAccountId: string, toAccountId: string): Promise<boolean> {
    await this.fill(this.amountInput, amount);
    await this.selectOption(this.fromAccountDropdown, fromAccountId);
    await this.selectOption(this.toAccountDropdown, toAccountId);
    await this.click(this.transferButton);
    await this.waitForNavigation();
    
    // Verify transfer was successful
    return await this.isElementVisible(this.transferCompleteTitle);
  }

  /**
   * Get transfer amount from confirmation page
   * @returns The transfer amount
   */
  async getTransferAmount(): Promise<string> {
    return await this.getElementText(this.transferAmount);
  }

  /**
   * Verify transfer funds page is displayed
   */
  async verifyTransferFundsPageIsDisplayed(): Promise<void> {
    await this.assertElementIsVisible(this.pageTitle);
    await this.assertElementIsVisible(this.amountInput);
    await this.assertElementIsVisible(this.fromAccountDropdown);
    await this.assertElementIsVisible(this.toAccountDropdown);
    await this.assertElementIsVisible(this.transferButton);
  }
}