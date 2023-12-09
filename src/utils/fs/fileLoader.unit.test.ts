import fs from 'fs';
import { fileLoader } from './fileLoader';

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs');

  return {
    ...originalModule,
    promises: {
      readFile: jest.fn(),
    },
  };
});

describe('file loader module', () => {
  afterAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should read a file from the file system', async () => {
    const mockFilePath = '/some/mock/path';
    const mockFileContent = 'mock content';
    (fs.promises.readFile as jest.Mock).mockResolvedValueOnce(mockFileContent);

    const result = await fileLoader(mockFilePath);

    expect(result).toBe(mockFileContent);
  });

  it.each([
    [0],
    [undefined],
    [{}],
    [false],
  ] as unknown[])('should fail by not passing a valid file path ( %p )', async (faultyPath) => {
    await expect(fileLoader(faultyPath as string)).rejects.toThrowError('Could not parse file path');
  });

  it('should fail by catching an error from the filesystem module', async () => {
    const mockFilePath = '/some/mock/path';
    const genericErrorMessage = 'something happened and theres nothing you can do right now';
    (fs.promises.readFile as jest.Mock).mockImplementationOnce(() => { throw new Error(genericErrorMessage); });

    await expect(fileLoader(mockFilePath as string)).rejects.toThrowError(`Could not read input file: ${genericErrorMessage}`);
  });
});
