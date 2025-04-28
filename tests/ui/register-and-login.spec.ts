import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { RegistrationPage } from '../page-objects/RegistrationPage';
import { HomePage } from '../page-objects/HomePage';
import { DataGenerator } from '../utils/DataGenerator';

test.describe('User Registration and Login Tests', () => {
  let loginPage: LoginPage;
  let registrationPage: RegistrationPage;
  let homePage: HomePage;
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
    
    // Generate random user data for each test
    testUserData = DataGenerator.generateTestUserData();
    
    // Navigate to the login page
    await loginPage.navigateToLoginPage();
  });

  test('should register a new user successfully', async () => {
    // Navigate to registration page
    await loginPage.navigateToRegistration();
    
    // Verify we are on the registration page
    expect(await page.title()).toContain('ParaBank | Register for Free Online Account');
    
    // Fill and submit registration form
    await registrationPage.registerUser(testUserData);
    
    // Verify registration was successful
    const success = await registrationPage.verifyRegistrationSuccess(testUserData.username);
    expect(success).toBeTruthy();
    
    // Verify welcome message contains username
    await homePage.verifyWelcomeMessage(testUserData.username);
  });

  test('should login with registered user credentials', async ({ page }) => {
    // First register a new user
    await loginPage.navigateToRegistration();
    await registrationPage.registerUser(testUserData);
    
    // Logout
    await homePage.logout();
    
    // Login with the registered user
    await loginPage.login(testUserData.username, testUserData.password);
    
    // Verify login was successful
    await homePage.verifyWelcomeMessage(testUserData.username);
  });

  test('should display error message for invalid login', async ({ page }) => {
    // Attempt login with invalid credentials
    await loginPage.login('invalid_username', 'invalid_password');
    
    // Verify error message is displayed
    expect(await loginPage.isErrorMessageDisplayed()).toBeTruthy();
    
    // Verify error message text
    const errorText = await loginPage.getErrorMessageText();
    expect(errorText).toContain('error');
  });
});