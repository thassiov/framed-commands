#!/usr/bin/env node

/* eslint-disable-next-line */
const inquirerSearchList = require('inquirer-search-list');

import { resolve } from 'path';
import inquirer from 'inquirer';

import CommandRunner from './command-runner';
import {IJSONConfigFile} from './definitions/IJSONConfigFile';
import {directoryLoader} from './internal-tools/directoryLoader';
import {fileLoader} from './internal-tools/fileLoader';
import {JSONParser} from './internal-tools/JSONParser';
import {logger} from './internal-tools/logger';
import {processCliArgs} from './internal-tools/parseCliArgs';
import {renderUi} from './ui';

async function getHomeConfigs () {
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

function getUserInput () {
  // gets argument (config file path) from the command line
  const args = processCliArgs(process.argv);
  return args[0];
}

async function runSelectionMenu(configs: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    inquirer.registerPrompt("search-list", inquirerSearchList);

    inquirer
    .prompt([
      {
        type: 'search-list',
        message: "Select config (listing contents from the '$HOME/.tuizer' directory)",
        name: 'selected',
        choices: configs.map(c => c.split('/').pop()),
      }
    ])
    .then(function({ selected }) {
      const config = configs.filter(c => c.endsWith(selected))[0];
      resolve(config as string);
    })
    .catch(e => reject(e));
  });
}

(async () => {
  try {

    const cliInputFileLocation = getUserInput();

    let filePath;

    if (cliInputFileLocation) {
      filePath = resolve(process.cwd(), cliInputFileLocation);
    } else {
      const configs = await getHomeConfigs();
      const selected = await runSelectionMenu(configs);
      filePath = selected;
    }

    // loads the file based on the cwd (why cwd?)
    const file = await fileLoader(filePath);

    // gets the 'commands' prop (an array) from the config file
    const { commands, name = '' } = JSONParser(file.toString()) as IJSONConfigFile;

    // Instantiated a new CommandRunner based on a list of commands
    const runner = new CommandRunner(commands);

    // start the frontend
    renderUi(runner, name);
  } catch (error) {
    logger.error(error);
  }
})();
