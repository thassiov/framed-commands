import { IJSONConfigFile } from '../../definitions/IJSONConfigFile';
import { configFileHandler } from '../../internal-tools/configFileHandler';

export async function manifestLoader(path: string): Promise<IJSONConfigFile> {
  return configFileHandler(path);
}
