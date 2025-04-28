import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly baseURL: string = 'https://parabank.parasoft.com';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param path the path to navigate to
   */
  async navigate(path: string = ''): Promise<void> {
    await this.page.goto(`${this.baseURL}${path}`);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get element text
   * @param locator The locator for the element
   * @returns The text content of the element
   */
  async getElementText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.innerText();
  }

  /**
   * Check if element is visible
   * @param locator The locator for the element
   * @returns True if the element is visible
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Click on an element
   * @param locator The locator for the element
   */
  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * Fill text in an input field
   * @param locator The locator for the input field
   * @param value The value to fill
   */
  async fill(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  /**
   * Select an option from a dropdown
   * @param locator The locator for the dropdown
   * @param value The value to select
   */
  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  /**
   * Get page title
   * @returns The page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Assert element has text
   * @param locator The locator for the element
   * @param text The text to check for
   */
  async assertElementHasText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }

  /**
   * Assert element is visible
   * @param locator The locator for the element
   */
  async assertElementIsVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Take a screenshot
   * @param name The name for the screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `./screenshots/${name}.png` });
  }
}