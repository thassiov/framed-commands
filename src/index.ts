import { resolve } from 'path';

import CommandRunner from './command-runner';
import {IJSONConfigFile} from './definitions/IJSONConfigFile';
import {fileLoader} from './internal-tools/fileLoader';
import {JSONParser} from './internal-tools/JSONParser';
import {logger} from './internal-tools/logger';
import {processCliArgs} from './internal-tools/parseCliArgs';
import {renderUi} from './ui';

(async () => {
  try {
    // gets argument (config file path) from the command line
    const args = processCliArgs(process.argv);

    // loads the file based on the cwd (why cwd?)
    const file = await fileLoader(resolve(process.cwd(), args[0] || ''));

    // gets the 'commands' prop (an array) from the config file
    const { commands, name = '' } = JSONParser(file.toString()) as IJSONConfigFile;

    // Instantiated a new CommandRunner based on a list of commands
    const runner = new CommandRunner(commands);

    renderUi(runner, name);
  } catch (error) {
    logger.error(error);
  }
})();
