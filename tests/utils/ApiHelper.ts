import { request } from '@playwright/test';

export class ApiHelper {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://parabank.parasoft.com/parabank/services/bank';
  }

  /**
   * Find transactions by amount
   * @param username The username
   * @param password The password
   * @param accountId The account ID
   * @param amount The amount to search for
   * @returns The response data
   */
  async findTransactionsByAmount(
    username: string, 
    password: string, 
    accountId: string, 
    amount: string
  ): Promise<any> {
    const apiContext = await request.newContext();
    const url = `${this.baseUrl}/accounts/${accountId}/transactions/amount/${amount}`;
    
    const response = await apiContext.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        username,
        password
      }
    });
    
    const data = await response.json();
    return {
      status: response.status(),
      data: data
    };
  }

  /**
   * Get account details
   * @param username The username
   * @param password The password
   * @param accountId The account ID
   * @returns The response data
   */
  async getAccountDetails(username: string, password: string, accountId: string): Promise<any> {
    const apiContext = await request.newContext();
    const url = `${this.baseUrl}/accounts/${accountId}`;
    
    const response = await apiContext.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        username,
        password
      }
    });
    
    const data = await response.json();
    return {
      status: response.status(),
      data: data
    };
  }

  /**
   * Validate transaction by amount
   * @param transactions The transactions to validate
   * @param amount The amount to validate
   * @returns True if the transaction with the specified amount exists
   */
  validateTransactionByAmount(transactions: any[], amount: string): boolean {
    if (!transactions || !Array.isArray(transactions)) {
      return false;
    }
    
    return transactions.some(transaction => 
      transaction.amount && transaction.amount.toString() === amount);
  }

  /**
   * Validate transaction details
   * @param transaction The transaction to validate
   * @returns True if the transaction has all required fields
   */
  validateTransactionDetails(transaction: any): boolean {
    const requiredFields = ['id', 'accountId', 'type', 'date', 'amount', 'description'];
    
    return requiredFields.every(field => transaction.hasOwnProperty(field));
  }
}