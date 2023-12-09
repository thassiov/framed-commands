import { idGenerator } from "./idGenerator";

describe('id generator module', () => {
  it.each([
    [5],
    [6],
    [7],
    [8],
    [9],
    [10],
  ])('should generate an id of %p size', (size) => {
    expect(idGenerator(size as number)).toHaveLength(size);
  });

  it('should fail by giving a id length of less than the minimal allowed', () => {
    expect(() => idGenerator(4)).toThrowError('Could not generate id as the Size is out of bounds. min: 5, max: 10 chars');
  });

  it('should fail by giving a id length of more than the maximum allowed', () => {
    expect(() => idGenerator(11)).toThrowError('Could not generate id as the Size is out of bounds. min: 5, max: 10 chars');
  });
});
