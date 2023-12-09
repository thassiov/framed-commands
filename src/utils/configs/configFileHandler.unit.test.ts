import { IConfigFile } from '../../definitions/IConfigFile';
import { fileLoader } from '../fs/fileLoader';
import { configFileHandler } from './configFileHandler';

jest.mock('../../internal-tools/fileLoader');

describe('Config file handler', () => {
  const mockJsonConfigFileStructure = {
    name: 'some name',
    commands: [
      {
        command: 'ls',
        parameters: [
          '-l',
          {
            type: 'string',
            parameter: '-a'
          },
        ],
      },
    ],
  } as IConfigFile ;

  const mockYamlConfigFileStructure = `
---
name: some name
commands:
  - command: ls
    parameters:
      - '-l'
      - type: string
        parameter: '-a'
`;

  afterAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should handle a json file', async () => {
    const mockJsonString = JSON.stringify(mockJsonConfigFileStructure);
    const mockFilePath = 'filepath';
    (fileLoader as jest.Mock).mockResolvedValueOnce(mockJsonString);

    const result = await configFileHandler(mockFilePath);

    expect(result).toStrictEqual(mockJsonConfigFileStructure);
  });

  it('should handle a yaml file', async () => {
    const mockFilePath = 'filepath.yaml';
    (fileLoader as jest.Mock).mockResolvedValueOnce(mockYamlConfigFileStructure);

    const result = await configFileHandler(mockFilePath);

    expect(result).toStrictEqual(mockJsonConfigFileStructure);
  });

  it.each([
    [0],
    [undefined],
    [{}],
    [false],
  ] as unknown[])('should fail by passing an invalid config file path ( %p )', async (faultyPath) => {
    await expect(configFileHandler(faultyPath as string)).rejects.toThrowError('Could not parse config file path');
  });

  it('should fail for passing invalid content as config file', async () => {
    const mockJsonString = JSON.stringify({
      kommands: mockJsonConfigFileStructure.commands,
      name: mockJsonConfigFileStructure.name,
    });

    const mockFilePath = 'filepath';
    (fileLoader as jest.Mock).mockResolvedValueOnce(mockJsonString);

    await expect(configFileHandler(mockFilePath)).rejects.toThrowError('The configuration provided does not follow the allowed schema');
  });

  it('should failt by trying to parse a yaml without a filename extension as yaml', async () => {
    const mockFilePath = 'filepath';
    (fileLoader as jest.Mock).mockResolvedValueOnce(mockYamlConfigFileStructure);

    await expect(configFileHandler(mockFilePath)).rejects.toThrowError('Could not parse json');
  });
});
