import { extname } from 'path';

import { IJSONConfigFile } from '../definitions/IJSONConfigFile';
import { fileLoader } from './fileLoader';
import {isValidConfigFile} from './isValidConfigFile';
import { json as jsonParser, yaml as yamlParser } from '../utils/parsers';

export async function configFileHandler(configFilePath: string): Promise<IJSONConfigFile> {
  const file = await fileLoader(configFilePath);

  let result;
  if (hasYamlExtension(configFilePath)) {
    result = yamlParser(file.toString());
  } else {
    result = jsonParser(file.toString());
  }

  if (!isValidConfigFile(result)) {
    throw new Error("The config provided is invalid.\nPlease refer to the documentation for more info about the config's structure");
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
