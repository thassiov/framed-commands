import { yaml } from "./yaml";

describe('YAML parser', () => {
  it('should correctly parse a yaml', () => {
    const testYaml = `
---
a: 1
b: 2
c: 3
`;

    const result = yaml(testYaml);

    expect(result).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });

  it.each([
    [0],
    [undefined],
    ['not yaml'],
    [{}],
    [false],
  ] as unknown[])('should throw an error when trying to parse a string which is not yaml ( %p )', (stringToParse) => {
    expect(() => yaml(stringToParse as string)).toThrowError('Could not parse yaml');
  });
});
