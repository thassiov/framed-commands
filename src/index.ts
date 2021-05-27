import { resolve } from 'path';

import CommandRunner from './command-runner';
import {IJSONConfigFile} from './definitions/IJSONConfigFile';
import {fileLoader} from './internal-tools/fileLoader';
import {JSONParser} from './internal-tools/JSONParser';
import {logger} from './internal-tools/logger';
import {processCliArgs} from './internal-tools/parseCliArgs';

(async () => {
  try {
    // gets argument (config file path) from the command line
    const args = processCliArgs(process.argv);

    // loads the file based on the cwd (why cwd?)
    const file = await fileLoader(resolve(process.cwd(), args[0]));

    // gets the 'commands' prop (an array) from the config file
    const { commands } = JSONParser(file.toString()) as IJSONConfigFile;

    // Instantiated a new CommandRunner based on a list of commands
    const runner = new CommandRunner(commands);
    runner.getCommandList().forEach((_, idx) => {
      logger.info(`trying to run the command #${idx}`);
      runner.runCommand(idx);
    });
  } catch (error) {
    logger.error(error);
  }
})();
