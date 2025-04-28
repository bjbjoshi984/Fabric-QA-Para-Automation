import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { RegistrationPage } from '../page-objects/RegistrationPage';
import { HomePage } from '../page-objects/HomePage';
import { OpenNewAccountPage } from '../page-objects/OpenNewAccountPage';
import { AccountsOverviewPage } from '../page-objects/AccountsOverviewPage';
import { TransferFundsPage } from '../page-objects/TransferFundsPage';
import { BillPayPage } from '../page-objects/BillPayPage';
import { FindTransactionsPage } from '../page-objects/FindTransactionsPage';
import { DataGenerator } from '../utils/DataGenerator';

test.describe('Navigation Menu Tests', () => {
  let loginPage: LoginPage;
  let registrationPage: RegistrationPage;
  let homePage: HomePage;
  let openNewAccountPage: OpenNewAccountPage;
  let accountsOverviewPage: AccountsOverviewPage;
  let transferFundsPage: TransferFundsPage;
  let billPayPage: BillPayPage;
  let findTransactionsPage: FindTransactionsPage;
  let testUserData: {
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
  };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    registrationPage = new RegistrationPage(page);
    homePage = new HomePage(page);
    openNewAccountPage = new OpenNewAccountPage(page);
    accountsOverviewPage = new AccountsOverviewPage(page);
    transferFundsPage = new TransferFundsPage(page);
    billPayPage = new BillPayPage(page);
    findTransactionsPage = new FindTransactionsPage(page);
    
    // Generate random user data
    testUserData = DataGenerator.generateTestUserData();
    
    // Navigate to the login page
    await loginPage.navigateToLoginPage();
    
    // Register a new user
    await loginPage.navigateToRegistration();
    await registrationPage.registerUser(testUserData);
  });

  test('should verify all navigation menu items are visible', async () => {
    // Verify all navigation menu items are visible
    await homePage.verifyNavigationMenuIsVisible();
  });

  test('should navigate to Open New Account page', async () => {
    // Navigate to Open New Account page
    await homePage.navigateToOpenNewAccount();
    
    // Verify Open New Account page is displayed
    await openNewAccountPage.verifyOpenNewAccountPageIsDisplayed();
  });

  test('should navigate to Accounts Overview page', async () => {
    // Navigate to Accounts Overview page
    await homePage.navigateToAccountsOverview();
    
    // Verify Accounts Overview page is displayed
    await accountsOverviewPage.verifyAccountsOverviewPageIsDisplayed();
  });

  test('should navigate to Transfer Funds page', async () => {
    // Navigate to Transfer Funds page
    await homePage.navigateToTransferFunds();
    
    // Verify Transfer Funds page is displayed
    await transferFundsPage.verifyTransferFundsPageIsDisplayed();
  });

  test('should navigate to Bill Pay page', async () => {
    // Navigate to Bill Pay page
    await homePage.navigateToBillPay();
    
    // Verify Bill Pay page is displayed
    await billPayPage.verifyBillPayPageIsDisplayed();
  });

  test('should navigate to Find Transactions page', async () => {
    // Navigate to Find Transactions page
    await homePage.navigateToFindTransactions();
    
    // Verify Find Transactions page is displayed
    await findTransactionsPage.verifyFindTransactionsPageIsDisplayed();
  });
});