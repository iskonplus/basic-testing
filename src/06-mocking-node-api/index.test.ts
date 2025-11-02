// Uncomment the code below and write your tests
jest.mock('fs', () => ({ existsSync: jest.fn() }));
jest.mock('fs/promises', () => ({ readFile: jest.fn() }));
jest.mock('path', () => ({ join: jest.fn(() => '/mocked/full/path') }));

import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

const asMock = (fn: unknown) => fn as jest.Mock;

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const cb = jest.fn();
    const spy = jest.spyOn(globalThis, 'setTimeout');
    doStuffByTimeout(cb, 1000);

    expect(spy).toHaveBeenCalledWith(cb, 1000);
    spy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const cb = jest.fn();
    doStuffByTimeout(cb, 1000);

    jest.advanceTimersByTime(999);
    expect(cb).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const cb = jest.fn();
    const spy = jest.spyOn(globalThis, 'setInterval');

    doStuffByInterval(cb, 500);

    expect(spy).toHaveBeenCalledWith(cb, 500);
    spy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const cb = jest.fn();
    doStuffByInterval(cb, 500);

    jest.advanceTimersByTime(499);
    expect(cb).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(cb).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);
    expect(cb).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(1000);
    expect(cb).toHaveBeenCalledTimes(4);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    asMock(existsSync).mockReturnValue(false);
    asMock(join).mockClear();

    await readFileAsynchronously('foo.txt');

    expect(asMock(join)).toHaveBeenCalledWith(expect.any(String), 'foo.txt');
  });

  test('should return null if file does not exist', async () => {
    asMock(existsSync).mockReturnValue(false);

    const result = await readFileAsynchronously('absent.txt');

    expect(result).toBeNull();
    expect(asMock(readFile)).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    asMock(existsSync).mockReturnValue(true);
    asMock(readFile).mockResolvedValue(Buffer.from('hello basic-testing'));

    const result = await readFileAsynchronously('present.txt');

    expect(result).toBe('hello basic-testing');

    expect(asMock(join)).toHaveBeenCalledWith(
      expect.any(String),
      'present.txt',
    );

    const existsPath = asMock(existsSync).mock.calls[0][0];
    const readPath = asMock(readFile).mock.calls[0][0];

    expect(readPath).toBe(existsPath);
  });
});
