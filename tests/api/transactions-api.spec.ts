import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { RegistrationPage } from '../page-objects/RegistrationPage';
import { HomePage } from '../page-objects/HomePage';
import { OpenNewAccountPage } from '../page-objects/OpenNewAccountPage';
import { AccountsOverviewPage } from '../page-objects/AccountsOverviewPage';
import { BillPayPage } from '../page-objects/BillPayPage';
import { DataGenerator } from '../utils/DataGenerator';
import { ApiHelper } from '../utils/ApiHelper';

test.describe('Transactions API Tests', () => {
  let loginPage: LoginPage;
  let registrationPage: RegistrationPage;
  let homePage: HomePage;
  let openNewAccountPage: OpenNewAccountPage;
  let accountsOverviewPage: AccountsOverviewPage;
  let billPayPage: BillPayPage;
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
  let existingAccountId: string;
  let savingsAccountId: string;
  let billPayAmount: string;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    registrationPage = new RegistrationPage(page);
    homePage = new HomePage(page);
    openNewAccountPage = new OpenNewAccountPage(page);
    accountsOverviewPage = new AccountsOverviewPage(page);
    billPayPage = new BillPayPage(page);
    apiHelper = new ApiHelper();
    
    // Generate random user data
    testUserData = DataGenerator.generateTestUserData();
    
    // Navigate to the login page
    await loginPage.navigateToLoginPage();
    
    // Register a new user
    await loginPage.navigateToRegistration();
    await registrationPage.registerUser(testUserData);
    
    // Get existing account ID
    await homePage.navigateToAccountsOverview();
    const accountNumbers = await accountsOverviewPage.getAllAccountNumbers();
    existingAccountId = accountNumbers[0];
    
    // Create a savings account
    await homePage.navigateToOpenNewAccount();
    savingsAccountId = await openNewAccountPage.openNewAccount('SAVINGS', existingAccountId);
    
    // Pay a bill from savings account
    await homePage.navigateToBillPay();
    const billPayData = DataGenerator.generateBillPayData(savingsAccountId);
    billPayAmount = billPayData.amount;
    await billPayPage.payBill(billPayData);
  });

  test('should find transactions by amount using API', async () => {
    // Find transactions by amount using API
    const response = await apiHelper.findTransactionsByAmount(
      testUserData.username,
      testUserData.password,
      savingsAccountId,
      billPayAmount
    );
    
    // Verify API response status
    expect(response.status).toBe(200);
    
    // Verify response data structure
    expect(response.data).toBeTruthy();
    
    // Verify transactions were found
    const transactions = Array.isArray(response.data) ? 
      response.data : 
      (response.data.transactions ? response.data.transactions : []);
    
    expect(transactions.length).toBeGreaterThan(0);
    
    // Validate transaction by amount
    const hasTransactionWithAmount = apiHelper.validateTransactionByAmount(
      transactions, 
      billPayAmount
    );
    expect(hasTransactionWithAmount).toBeTruthy();
    
    // Validate transaction details
    const transaction = transactions[0];
    expect(apiHelper.validateTransactionDetails(transaction)).toBeTruthy();
    
    // Verify transaction fields
    expect(transaction.accountId).toBe(parseInt(savingsAccountId));
    expect(transaction.amount).toBe(parseInt(billPayAmount));
    expect(transaction.type).toBeTruthy();
    expect(transaction.date).toBeTruthy();
    expect(transaction.description).toBeTruthy();
  });

  test('should get account details using API', async () => {
    // Get account details using API
    const response = await apiHelper.getAccountDetails(
      testUserData.username,
      testUserData.password,
      savingsAccountId
    );
    
    // Verify API response status
    expect(response.status).toBe(200);
    
    // Verify response data structure
    expect(response.data).toBeTruthy();
    
    // Verify account details
    expect(response.data.id).toBe(parseInt(savingsAccountId));
    expect(response.data.customerId).toBeTruthy();
    expect(response.data.type).toBe('SAVINGS');
    expect(response.data.balance).toBeTruthy();
  });
});