import { json } from './json';

describe('JSON parser', () => {
  it('should correctly parse a json', () => {
    const testObject = {
      a: 1,
      b: 2,
      c: 3,
    };

    const jsonString = JSON.stringify(testObject);

    const result = json(jsonString);

    expect(result).toEqual(testObject);
  });

  it.each([
    [0],
    [undefined],
    ['not json'],
    [{}],
    [false],
  ] as unknown[])('should throw an error when trying to parse a string which is not json ( %p )', (stringToParse) => {
    expect(() => json(stringToParse as string)).toThrowError('Could not parse json');
  })
});
