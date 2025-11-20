// Uncomment the code below and write your tests
jest.mock('lodash', () => ({ random: jest.fn() }));
import { random } from 'lodash';
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from './index';

const asMock = (fn: unknown) => fn as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(100);
    expect(bankAccount.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bankAccount = getBankAccount(100);
    expect(() => bankAccount.withdraw(101)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const fromBankAccount = getBankAccount(100);
    const toBankAccount = getBankAccount(100);
    expect(() => fromBankAccount.transfer(101, toBankAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(100);
    expect(() => bankAccount.transfer(100, bankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(100);
    expect(bankAccount.deposit(25).getBalance()).toBe(125);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(100);
    expect(bankAccount.withdraw(40).getBalance()).toBe(60);
  });

  test('should transfer money', () => {
    const fromBankAccount = getBankAccount(100);
    const toBankAccount = getBankAccount(100);
    expect(fromBankAccount.transfer(40, toBankAccount).getBalance()).toBe(60);
    expect(toBankAccount.getBalance()).toBe(140);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    asMock(random).mockReturnValueOnce(42).mockReturnValueOnce(1);

    const bankAccount = getBankAccount(0);
    await expect(bankAccount.fetchBalance()).resolves.toBe(42);
    expect(asMock(random)).toHaveBeenCalledTimes(2);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount = getBankAccount(5);
    const spy = jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(77);

    await bankAccount.synchronizeBalance();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(bankAccount.getBalance()).toBe(77);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const acc = getBankAccount(5);
    jest.spyOn(acc, 'fetchBalance').mockResolvedValue(null);

    await expect(acc.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
