import { IJSONConfigFile } from '../definitions/IJSONConfigFile';
import { yamlToJson } from './contentTypeConverter';
import { fileLoader } from './fileLoader';
import { isValidConfigFile } from './isValidConfigFile';

export async function configFileHandler(configFilePath: string): Promise<IJSONConfigFile> {
  const fileContents = await fileLoader(configFilePath);
  let config = await yamlToJson(fileContents);

  // for when we have a yaml
  if (typeof config == 'string') {
    try {
      config = JSON.parse(config);
    } catch (jsonError) {
      throw new Error(`The contents of ${configFilePath} do not follow the correct config structure ${fileContents}`);
    }
  }

  if (!isValidConfigFile(config)) {
    throw new Error("The config provided is invalid.\nPlease refer to the documentation for more info about the config's structure");
  }

  return config as IJSONConfigFile;
}
