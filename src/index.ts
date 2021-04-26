import { resolve } from 'path';

import CommandRunner from './command-runner';
import {IJSONConfigFile} from './definitions/IJSONConfigFile';
import {fileLoader} from './internal-tools/fileLoader';
import {JSONParser} from './internal-tools/JSONParser';
import {logger} from './internal-tools/logger';
import {processCliArgs} from './internal-tools/parseCliArgs';

(async () => {
  try {
    const args = processCliArgs(process.argv);
    const file = await fileLoader(resolve(process.cwd(), args[0]));
    const { commands } = JSONParser(file.toString()) as IJSONConfigFile;
    const runner = new CommandRunner(commands);
    runner.getCommandList().forEach((_, idx) => {
      logger.info(`trying to run the command #${idx}`);
      runner.runCommand(idx);
    });
  } catch (error) {
    logger.error(error);
  }
})();
