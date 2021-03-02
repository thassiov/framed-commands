import fileLoader from '../../src/file-loader';

describe('File Loader', () => {
  test('no input file given', async () => {
    await expect(fileLoader('')).rejects.toThrow('No input file provided');
  });

  test.each([
    'sdfkajf',
    false,
    13
  ])('throw for invalid input %p', async (input) => {
    await expect(fileLoader(input.toString())).rejects.toThrow('Cannot reach input file');
  });
});
