import { extname } from 'path';
import { z } from 'zod';

import { json as jsonParser, yaml as yamlParser } from '../parsers';
import { fileLoader } from '../../internal-tools/fileLoader';
import { isValidConfigFile } from '../../internal-tools/isValidConfigFile';
import { IJSONConfigFile } from '../../definitions/IJSONConfigFile';
import { ConfigError, ParsingError } from '../errors';

const pathStringSchema = z.string();

type pathStringType = z.infer<typeof pathStringSchema>;

export async function configFileHandler(configFilePath: pathStringType): Promise<IJSONConfigFile> {
  if (!pathStringSchema.safeParse(configFilePath).success) {
    throw new ParsingError('Could not parse config file path', { data: configFilePath });
  }

  const file = await fileLoader(configFilePath);

  let result;
  if (hasYamlExtension(configFilePath)) {
    result = yamlParser(file.toString());
  } else {
    result = jsonParser(file.toString());
  }

  if (!isValidConfigFile(result)) {
    throw new ConfigError("The configuration provided does not follow the allowed schema", { data: JSON.stringify(result) });
  }

  return result as IJSONConfigFile;
}

function hasYamlExtension(filePath: string): boolean {
  const ext = extname(filePath);

  if(ext.endsWith('yaml') || ext.endsWith('yml')) {
    return true;
  }

  return false;
}
