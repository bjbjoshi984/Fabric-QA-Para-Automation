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

test.describe('Banking Operations Tests', () => {
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
  let existingAccountId: string;
  let newSavingsAccountId: string;
  let billPayAmount: string;

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
    
    // Get existing account ID
    await homePage.navigateToAccountsOverview();
    const accountNumbers = await accountsOverviewPage.getAllAccountNumbers();
    existingAccountId = accountNumbers[0];
  });

  test('should create a new savings account', async () => {
    // Navigate to Open New Account page
    await homePage.navigateToOpenNewAccount();
    
    // Open a new savings account
    newSavingsAccountId = await openNewAccountPage.openNewAccount('SAVINGS', existingAccountId);
    
    // Verify account was created
    expect(newSavingsAccountId).toBeTruthy();
    expect(newSavingsAccountId.length).toBeGreaterThan(0);
    
    // Navigate to Accounts Overview page
    await homePage.navigateToAccountsOverview();
    
    // Verify the new account appears in the accounts list
    const accountNumbers = await accountsOverviewPage.getAllAccountNumbers();
    expect(accountNumbers).toContain(newSavingsAccountId);
  });

  test('should validate accounts overview displays correct balance details', async () => {
    // First create a new savings account
    await homePage.navigateToOpenNewAccount();
    newSavingsAccountId = await openNewAccountPage.openNewAccount('SAVINGS', existingAccountId);
    
    // Navigate to Accounts Overview page
    await homePage.navigateToAccountsOverview();
    
    // Get account details for the new savings account
    const accountDetails = await accountsOverviewPage.getAccountDetails(newSavingsAccountId);
    
    // Verify account details exist
    expect(accountDetails).toBeTruthy();
    
    // Verify balance format (should be a currency format)
    expect(accountDetails?.balance).toMatch(/\$\d+\.\d{2}/);
    
    // Verify available amount format (should be a currency format)
    expect(accountDetails?.availableAmount).toMatch(/\$\d+\.\d{2}/);
  });

  test('should transfer funds between accounts', async () => {
    // First create a new savings account
    await homePage.navigateToOpenNewAccount();
    newSavingsAccountId = await openNewAccountPage.openNewAccount('SAVINGS', existingAccountId);
    
    // Navigate to Transfer Funds page
    await homePage.navigateToTransferFunds();
    
    // Transfer $100 from existing account to new savings account
    const transferAmount = '100';
    const transferSuccess = await transferFundsPage.transferFunds(
      transferAmount, 
      existingAccountId, 
      newSavingsAccountId
    );
    
    // Verify transfer was successful
    expect(transferSuccess).toBeTruthy();
    
    // Verify transfer amount
    const confirmedAmount = await transferFundsPage.getTransferAmount();
    expect(confirmedAmount).toContain(transferAmount);
  });

  test('should pay a bill from savings account', async () => {
    // First create a new savings account
    await homePage.navigateToOpenNewAccount();
    newSavingsAccountId = await openNewAccountPage.openNewAccount('SAVINGS', existingAccountId);
    
    // Transfer money to the savings account
    await homePage.navigateToTransferFunds();
    await transferFundsPage.transferFunds('500', existingAccountId, newSavingsAccountId);
    
    // Navigate to Bill Pay page
    await homePage.navigateToBillPay();
    
    // Generate bill pay data
    const billPayData = DataGenerator.generateBillPayData(newSavingsAccountId);
    billPayAmount = billPayData.amount;
    
    // Pay bill
    const billPaySuccess = await billPayPage.payBill(billPayData);
    
    // Verify bill payment was successful
    expect(billPaySuccess).toBeTruthy();
    
    // Store bill payment amount for API test
    test.info().annotations.push({
      type: 'billPayAmount',
      description: billPayAmount
    });
  });

  test('should find transactions by amount', async () => {
    // First create a new savings account
    await homePage.navigateToOpenNewAccount();
    newSavingsAccountId = await openNewAccountPage.openNewAccount('SAVINGS', existingAccountId);
    
    // Transfer money to the savings account
    await homePage.navigateToTransferFunds();
    await transferFundsPage.transferFunds('500', existingAccountId, newSavingsAccountId);
    
    // Pay a bill
    await homePage.navigateToBillPay();
    const billPayData = DataGenerator.generateBillPayData(newSavingsAccountId);
    billPayAmount = billPayData.amount;
    await billPayPage.payBill(billPayData);
    
    // Navigate to Find Transactions page
    await homePage.navigateToFindTransactions();
    
    // Find transactions by amount
    const foundTransactions = await findTransactionsPage.findTransactionsByAmount(
      newSavingsAccountId, 
      billPayAmount
    );
    
    // Verify transactions were found
    expect(foundTransactions).toBeTruthy();
    
    // Get all transactions
    const transactions = await findTransactionsPage.getAllTransactions();
    
    // Verify at least one transaction was found
    expect(transactions.length).toBeGreaterThan(0);
    
    // Verify transaction amount matches the bill payment amount
    const foundTransaction = transactions.find(t => t.amount === `-$${billPayAmount}.00`);
    expect(foundTransaction).toBeTruthy();
  });
});