import fs from 'fs';
import { directoryLoader } from './directoryLoader';

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs');

  return {
    ...originalModule,
    promises: {
      readdir: jest.fn(),
    },
  };
});

describe('directory loader module', () => {
  afterAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should read a directory from the file system', async () => {
    const mockDirectoryPath = '/some/mock/path';
    const mockDirectoryContent = 'mockcontent\nanothermockcontent';
    (fs.promises.readdir as jest.Mock).mockResolvedValueOnce(mockDirectoryContent);

    const result = await directoryLoader(mockDirectoryPath);

    expect(result).toBe(mockDirectoryContent);
  });

  it.each([
    [0],
    [undefined],
    [{}],
    [false],
  ] as unknown[])('should fail by not passing a valid directory path ( %p )', async (faultyPath) => {
    await expect(directoryLoader(faultyPath as string)).rejects.toThrowError('Could not parse directory path');
  });

  it('should fail by catching an error from the filesystem module', async () => {
    const mockDirectoryPath = '/some/mock/path';
    const genericErrorMessage = 'something happened and theres nothing you can do right now';
    (fs.promises.readdir as jest.Mock).mockImplementationOnce(() => { throw new Error(genericErrorMessage); });

    await expect(directoryLoader(mockDirectoryPath as string)).rejects.toThrowError(`Could not read input directory: ${genericErrorMessage}`);
  });
});

