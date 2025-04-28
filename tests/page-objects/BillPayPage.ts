import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BillPayPage extends BasePage {
  // Bill pay form locators
  readonly payeeNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly accountNumberInput: Locator;
  readonly verifyAccountInput: Locator;
  readonly amountInput: Locator;
  readonly fromAccountDropdown: Locator;
  readonly sendPaymentButton: Locator;
  readonly billPaymentCompleteTitle: Locator;
  readonly pageTitle: Locator;
  readonly paymentAmount: Locator;

  constructor(page: Page) {
    super(page);
    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.addressInput = page.locator('input[name="payee.address.street"]');
    this.cityInput = page.locator('input[name="payee.address.city"]');
    this.stateInput = page.locator('input[name="payee.address.state"]');
    this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');
    this.phoneNumberInput = page.locator('input[name="payee.phoneNumber"]');
    this.accountNumberInput = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.fromAccountDropdown = page.locator('select[name="fromAccountId"]');
    this.sendPaymentButton = page.locator('input[value="Send Payment"]');
    this.billPaymentCompleteTitle = page.locator('h1.title').filter({ hasText: 'Bill Payment Complete' });
    this.pageTitle = page.locator('h1.title').filter({ hasText: 'Bill Pay' });
    this.paymentAmount = page.locator('span#amount');
  }

  /**
   * Navigate to the bill pay page
   */
  async navigateToBillPay(): Promise<void> {
    await this.navigate('/parabank/billpay.htm');
    await this.waitForNavigation();
  }

  /**
   * Pay a bill
   * @param billPayData The bill payment data
   * @returns True if bill payment was successful
   */
  async payBill(billPayData: {
    payeeName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    accountNumber: string;
    amount: string;
    fromAccountId: string;
  }): Promise<boolean> {
    await this.fill(this.payeeNameInput, billPayData.payeeName);
    await this.fill(this.addressInput, billPayData.address);
    await this.fill(this.cityInput, billPayData.city);
    await this.fill(this.stateInput, billPayData.state);
    await this.fill(this.zipCodeInput, billPayData.zipCode);
    await this.fill(this.phoneNumberInput, billPayData.phoneNumber);
    await this.fill(this.accountNumberInput, billPayData.accountNumber);
    await this.fill(this.verifyAccountInput, billPayData.accountNumber);
    await this.fill(this.amountInput, billPayData.amount);
    await this.selectOption(this.fromAccountDropdown, billPayData.fromAccountId);
    await this.click(this.sendPaymentButton);
    await this.waitForNavigation();
    
    // Verify bill payment was successful
    return await this.isElementVisible(this.billPaymentCompleteTitle);
  }

  /**
   * Get payment amount from confirmation page
   * @returns The payment amount
   */
  async getPaymentAmount(): Promise<string> {
    return await this.getElementText(this.paymentAmount);
  }

  /**
   * Verify bill pay page is displayed
   */
  async verifyBillPayPageIsDisplayed(): Promise<void> {
    await this.assertElementIsVisible(this.pageTitle);
    await this.assertElementIsVisible(this.payeeNameInput);
    await this.assertElementIsVisible(this.addressInput);
    await this.assertElementIsVisible(this.amountInput);
    await this.assertElementIsVisible(this.fromAccountDropdown);
    await this.assertElementIsVisible(this.sendPaymentButton);
  }
}