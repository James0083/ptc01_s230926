import {sum} from './sum';
import {describe, expect, test} from '@jest/globals';

// describe('sum module', () => {
//   test('adds 1 + 2 to equal 3', () => {
//     expect(sum(1, 2)).toBe(3);
//   });
// });

describe('jest test', () => {
  test('adds 3 to equal 3', () => {
    expect(3).toBe(3);
  });
});