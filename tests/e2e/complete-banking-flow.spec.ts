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
import { ApiHelper } from '../utils/ApiHelper';

test.describe('Complete Banking Flow Tests', () => {
  let loginPage: LoginPage;
  let registrationPage: RegistrationPage;
  let homePage: HomePage;
  let openNewAccountPage: OpenNewAccountPage;
  let accountsOverviewPage: AccountsOverviewPage;
  let transferFundsPage: TransferFundsPage;
  let billPayPage: BillPayPage;
  let findTransactionsPage: FindTransactionsPage;
  let apiHelper: ApiHelper;
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

  test('complete banking workflow from registration to API validation', async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    registrationPage = new RegistrationPage(page);
    homePage = new HomePage(page);
    openNewAccountPage = new OpenNewAccountPage(page);
    accountsOverviewPage = new AccountsOverviewPage(page);
    transferFundsPage = new TransferFundsPage(page);
    billPayPage = new BillPayPage(page);
    findTransactionsPage = new FindTransactionsPage(page);
    apiHelper = new ApiHelper();
    
    // 1. Navigate to Para bank application
    await loginPage.navigateToLoginPage();
    
    // 2. Create a new user from user registration page
    testUserData = DataGenerator.generateTestUserData();
    await loginPage.navigateToRegistration();
    await registrationPage.registerUser(testUserData);
    
    // Verify registration was successful
    const registrationSuccess = await registrationPage.verifyRegistrationSuccess(testUserData.username);
    expect(registrationSuccess).toBeTruthy();
    
    // 3. Login to the application with the user created in step 2
    // (Already logged in after registration)
    await homePage.verifyWelcomeMessage(testUserData.username);
    
    // 4. Verify if the Global navigation menu in home page is working as expected
    await homePage.verifyNavigationMenuIsVisible();
    
    // Test each navigation menu item
    await homePage.navigateToAccountsOverview();
    await accountsOverviewPage.verifyAccountsOverviewPageIsDisplayed();
    
    // Get existing account ID
    const accountNumbers = await accountsOverviewPage.getAllAccountNumbers();
    const existingAccountId = accountNumbers[0];
    
    // 5. Create a Savings account from "Open New Account Page" and capture the account number
    await homePage.navigateToOpenNewAccount();
    const savingsAccountId = await openNewAccountPage.openNewAccount('SAVINGS', existingAccountId);
    expect(savingsAccountId).toBeTruthy();
    expect(savingsAccountId.length).toBeGreaterThan(0);
    
    // 6. Validate if Accounts overview page is displaying the balance details as expected
    await homePage.navigateToAccountsOverview();
    const accountDetails = await accountsOverviewPage.getAccountDetails(savingsAccountId);
    expect(accountDetails).toBeTruthy();
    expect(accountDetails?.balance).toMatch(/\$\d+\.\d{2}/);
    expect(accountDetails?.availableAmount).toMatch(/\$\d+\.\d{2}/);
    
    // 7. Transfer funds from account created in step 5 to another account
    // First, transfer some money to the savings account
    await homePage.navigateToTransferFunds();
    await transferFundsPage.transferFunds('500', existingAccountId, savingsAccountId);
    
    // Then transfer some money back to demonstrate a transfer from the savings account
    await homePage.navigateToTransferFunds();
    const transferSuccess = await transferFundsPage.transferFunds('100', savingsAccountId, existingAccountId);
    expect(transferSuccess).toBeTruthy();
    
    // 8. Pay the bill with account created in step 5
    await homePage.navigateToBillPay();
    const billPayData = DataGenerator.generateBillPayData(savingsAccountId);
    const billPayAmount = billPayData.amount;
    const billPaySuccess = await billPayPage.payBill(billPayData);
    expect(billPaySuccess).toBeTruthy();
    
    // 9. Add necessary assertions at each test step whenever it is needed
    // (Assertions have been added throughout the test)
    
    // API Test scenarios:
    // 1. Search the transactions using "Find transactions" API call by amount
    const apiResponse = await apiHelper.findTransactionsByAmount(
      testUserData.username,
      testUserData.password,
      savingsAccountId,
      billPayAmount
    );
    
    // 2. Validate the details displayed in Json response
    expect(apiResponse.status).toBe(200);
    expect(apiResponse.data).toBeTruthy();
    
    // Verify transactions were found
    const transactions = Array.isArray(apiResponse.data) ? 
      apiResponse.data : 
      (apiResponse.data.transactions ? apiResponse.data.transactions : []);
    
    expect(transactions.length).toBeGreaterThan(0);
    
    // Validate transaction by amount
    const hasTransactionWithAmount = apiHelper.validateTransactionByAmount(
      transactions, 
      billPayAmount
    );
    expect(hasTransactionWithAmount).toBeTruthy();
    
    // Validate transaction details
    const transaction = transactions.find(t => t.amount.toString() === billPayAmount);
    if (transaction) {
      expect(apiHelper.validateTransactionDetails(transaction)).toBeTruthy();
      expect(transaction.accountId).toBe(parseInt(savingsAccountId));
      expect(transaction.type).toBeTruthy();
      expect(transaction.date).toBeTruthy();
      expect(transaction.description).toBeTruthy();
    }
  });
});