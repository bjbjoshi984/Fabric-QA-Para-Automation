import crypto from 'crypto';

export class DataGenerator {
  /**
   * Generate a random username
   * @returns A random username
   */
  static generateRandomUsername(): string {
    return `user_${crypto.randomBytes(8).toString('hex')}`;
  }

  /**
   * Generate a random password
   * @param length The length of the password
   * @returns A random password
   */
  static generateRandomPassword(length: number = 10): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  }

  /**
   * Generate a random SSN
   * @returns A random SSN (Social Security Number)
   */
  static generateRandomSSN(): string {
    const area = this.getRandomNumber(100, 999).toString();
    const group = this.getRandomNumber(10, 99).toString();
    const serial = this.getRandomNumber(1000, 9999).toString();
    
    return `${area}-${group}-${serial}`;
  }

  /**
   * Generate a random phone number
   * @returns A random phone number
   */
  static generateRandomPhoneNumber(): string {
    const areaCode = this.getRandomNumber(200, 999).toString();
    const prefix = this.getRandomNumber(200, 999).toString();
    const lineNumber = this.getRandomNumber(1000, 9999).toString();
    
    return `${areaCode}-${prefix}-${lineNumber}`;
  }

  /**
   * Generate a random amount
   * @param min The minimum amount
   * @param max The maximum amount
   * @returns A random amount
   */
  static generateRandomAmount(min: number = 10, max: number = 1000): string {
    const amount = this.getRandomNumber(min, max);
    return amount.toString();
  }

  /**
   * Generate test user data
   * @returns Complete user data for registration
   */
  static generateTestUserData(): {
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
  } {
    return {
      firstName: 'Test',
      lastName: 'User',
      address: '123 Test Street',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      phoneNumber: this.generateRandomPhoneNumber(),
      ssn: this.generateRandomSSN(),
      username: this.generateRandomUsername(),
      password: this.generateRandomPassword()
    };
  }

  /**
   * Generate bill pay data
   * @returns Complete bill pay data
   */
  static generateBillPayData(fromAccountId: string): {
    payeeName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    accountNumber: string;
    amount: string;
    fromAccountId: string;
  } {
    return {
      payeeName: 'Test Payee',
      address: '456 Bill Street',
      city: 'Bill City',
      state: 'BC',
      zipCode: '67890',
      phoneNumber: this.generateRandomPhoneNumber(),
      accountNumber: this.getRandomNumber(10000, 99999).toString(),
      amount: this.generateRandomAmount(50, 200),
      fromAccountId: fromAccountId
    };
  }

  /**
   * Get a random number in a range
   * @param min The minimum number
   * @param max The maximum number
   * @returns A random number
   */
  private static getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}