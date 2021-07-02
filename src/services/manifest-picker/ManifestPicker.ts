import { resolve } from 'path';
import {IJSONConfigFile} from '../../definitions/IJSONConfigFile';
import {configFileHandler} from '../../internal-tools/configFileHandler';

import { directoryLoader } from '../../internal-tools/directoryLoader';

export default class ManifestPicker {
  // Later I'll pass configs in this constructor

  async listManifests(): Promise<string[]> {
    if(!process.env.HOME) {
      throw new Error('HOME env var is not set. Exiting');
    }

    const configsLocation = resolve(process.env.HOME, '.tuizer');

    let content;
    try {
      content = await directoryLoader(configsLocation);
    } catch (dirErr) {
      if (dirErr.code == 'ENOENT') {
        throw new Error('No $HOME/.tuizer directory found. Exiting');
      }
      throw dirErr;
    }

    if (!content.length) {
      throw new Error('No files found at $HOME/.tuizer. Exiting ');
    }

    return content.map((config) => resolve(configsLocation, config));
  }

  async loadManifest(configFilePath: string): Promise<Promise<IJSONConfigFile>> {
    return await configFileHandler(configFilePath);
  }
}
