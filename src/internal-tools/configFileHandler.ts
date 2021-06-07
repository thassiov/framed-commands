import { extname } from 'path';

import { IJSONConfigFile } from '../definitions/IJSONConfigFile';
import {yamlToJson} from './contentTypeConverter';
import { fileLoader } from './fileLoader';
import {isValidConfigFile} from './isValidConfigFile';
import { JSONParser } from './JSONParser';

export async function configFileHandler(configFilePath: string): Promise<IJSONConfigFile> {
  const file = await fileLoader(configFilePath);

  let result;
  if (hasYamlExtension(configFilePath)) {
    result = await yamlToJson(file.toString());
  } else {
    result = JSONParser(file.toString());
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
