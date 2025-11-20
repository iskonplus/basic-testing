// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 3, b: 2, action: Action.Subtract, expected: 1 },
  { a: 2, b: 2, action: Action.Multiply, expected: 4 },
  { a: 10, b: 4, action: Action.Divide, expected: 2.5 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
];

const invalidArgCases = [
  { a: '5', b: 2, action: Action.Add },
  { a: undefined, b: 2, action: Action.Add },
  { a: null, b: 2, action: Action.Add },
];

const invalidActionCases = [{ a: 2, b: 2, action: 'unknown' }];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'returns $expected for input: %o',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBeCloseTo(expected);
    },
  );

  test.each(invalidArgCases)(
    'returns null for invalid arguments: %o',
    (input) => {
      expect(simpleCalculator(input)).toBeNull();
    },
  );

  test.each(invalidActionCases)(
    'returns null for invalid action: %o',
    (input) => {
      expect(simpleCalculator(input)).toBeNull();
    },
  );
});
