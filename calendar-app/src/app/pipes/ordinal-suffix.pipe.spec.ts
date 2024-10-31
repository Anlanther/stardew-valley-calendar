import { OrdinalSuffixPipe } from './ordinal-suffix.pipe';

describe('OrdinalSuffixPipe', () => {
  let pipe: OrdinalSuffixPipe;

  beforeEach(() => {
    pipe = new OrdinalSuffixPipe();
  });

  it('should throw an error for invalid date format', () => {
    const expected = new Error('Invalid date format');
    const invalidDateString = 'Invalid';

    expect(() => pipe.transform(invalidDateString)).toThrow(expected);
  });

  it('should add the correct ordinal suffix for each date', () => {
    const mockDateTests = [
      { input: '1 January', expected: '1st January' },
      { input: '2 February', expected: '2nd February' },
      { input: '3 March', expected: '3rd March' },
      { input: '4 April', expected: '4th April' },
      { input: '11 May', expected: '11th May' },
      { input: '12 June', expected: '12th June' },
      { input: '13 July', expected: '13th July' },
      { input: '21 August', expected: '21st August' },
      { input: '22 September', expected: '22nd September' },
      { input: '23 October', expected: '23rd October' },
      { input: '24 November', expected: '24th November' },
      { input: '30 December', expected: '30th December' },
    ];

    mockDateTests.forEach((test) =>
      expect(pipe.transform(test.input)).toBe(test.expected),
    );
  });
});
