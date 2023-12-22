import { resolve } from 'path';
import { IConfigFile } from '../../definitions/IConfigFile';

import { configFileHandler } from '../../utils/configs/configFileHandler';
import { directoryLoader } from '../../utils/fs/directoryLoader';
import { logger } from '../../utils/logger';
import { CustomError } from '../../utils/errors';

// @TODO the name will probably change later
export const FRAMED_DIR = '.config/framed-commands';
export const FRAMED_CONFIGS_DIR = `${FRAMED_DIR}/frames`;

export default class ManifestPicker {
  static async listManifests(): Promise<string[]> {
    if(!process.env.HOME) {
      throw new Error('HOME env var is not set. Exiting');
    }

    const configsLocation = resolve(process.env.HOME, FRAMED_CONFIGS_DIR);

    let content;
    try {
      content = await directoryLoader(configsLocation);
    } catch (error) {
      // @TODO better error message. describe the correct permissions or ask for it to be created
      logger.error(`Could not read the contents of ${configsLocation}. Either we don't have access to the directory or it does not exist`);
      throw new CustomError(`Could not read the contents of ${configsLocation}. Either we don't have access to it or it does not exist`, {}, error as Error);
    }

    // @NOTE if the frames directory is empty, we will simply send an empty list forward
    // The command center should be able to add frames on the fly in the future
    return content.map((config) => resolve(configsLocation, config));
  }

  static async loadManifest(configFilePath: string): Promise<Promise<IConfigFile>> {
    return await configFileHandler(configFilePath);
  }
}
