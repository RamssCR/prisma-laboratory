import { describe, expect, test, vi } from 'vitest';

describe('Example Test Suite', () => {
  test('should mock console methods', () => {
    const consoleError = vi.spyOn(console, 'error');
    const consoleLog = vi.spyOn(console, 'log');

    console.error('This is an error');
    console.log('This is a log');

    expect(consoleError).toHaveBeenCalledWith('This is an error');
    expect(consoleLog).toHaveBeenCalledWith('This is a log');

    consoleError.mockRestore();
    consoleLog.mockRestore();
  });

  test('should mock environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  test('should return a promise that resolves to a value', () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve('resolved value'), 25);
    });

    return expect(promise).resolves.toBe('resolved value');
  });
});
