// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const result = simpleCalculator({ a: 1, b: 2, action: Action.Add });
    expect(result).toBe(3);
  });

  test('should subtract two numbers', () => {
    const result = simpleCalculator({ a: 3, b: 2, action: Action.Subtract });
    expect(result).toBe(1);
  });

  test('should multiply two numbers', () => {
    const result = simpleCalculator({ a: 2, b: 2, action: Action.Multiply });
    expect(result).toBe(4);
  });

  test('should divide two numbers', () => {
    const result = simpleCalculator({ a: 10, b: 4, action: Action.Divide });
    expect(result).toBe(2.5);
  });

  test('should exponentiate two numbers', () => {
    const result = simpleCalculator({
      a: 2,
      b: 3,
      action: Action.Exponentiate,
    });
    expect(result).toBe(8);
  });

  test('should return null for invalid action', () => {
    const result = simpleCalculator({ a: 2, b: 2, action: 'unknown' });
    expect(result).toBeNull();
  });

  test('should return null for non-number argument "a"', () => {
    const result = simpleCalculator({ a: '5', b: 2, action: Action.Add });
    expect(result).toBeNull();
  });

  test('should return null for undefined argument "a"', () => {
    const result = simpleCalculator({
      a: undefined,
      b: 2,
      action: Action.Add,
    });
    expect(result).toBeNull();
  });

  test('should return null for null argument "a"', () => {
    const result = simpleCalculator({ a: null, b: 2, action: Action.Add });
    expect(result).toBeNull();
  });
});
