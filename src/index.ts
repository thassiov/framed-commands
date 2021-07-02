#!/usr/bin/env node

/* eslint-disable-next-line */
// const inquirerSearchList = require('inquirer-search-list');
//
// import { resolve } from 'path';
// import inquirer from 'inquirer';
//
// import CommandsService from './services/commands';
// import {directoryLoader} from './internal-tools/directoryLoader';
// import { configFileHandler } from './internal-tools/configFileHandler';
import { logger } from './internal-tools/logger';
// import { processCliArgs } from './internal-tools/parseCliArgs';
import { renderUi } from './ui';

// This represents the number of max items in the menu list
process.env.MENU_HEIGHT = '10';

/* async function getHomeConfigs () {
 *   if(!process.env.HOME) {
 *     throw new Error('HOME env var is not set. Exiting');
 *   }
 *
 *   const configsLocation = resolve(process.env.HOME, '.tuizer');
 *
 *   let content;
 *   try {
 *   content = await directoryLoader(configsLocation);
 *   } catch (dirErr) {
 *     if (dirErr.code == 'ENOENT') {
 *       throw new Error('No $HOME/.tuizer directory found. Exiting');
 *     }
 *     throw dirErr;
 *   }
 *
 *   if (!content.length) {
 *     throw new Error('No files found at $HOME/.tuizer. Exiting ');
 *   }
 *
 *   return content.map((config) => resolve(configsLocation, config));
 * } */

/* function getUserInput () {
 *   // gets argument (config file path) from the command line
 *   const args = processCliArgs(process.argv);
 *   return args[0];
 * } */

/* async function runSelectionMenu(configs: string[]): Promise<string> {
 *   return new Promise((resolve, reject) => {
 *     inquirer.registerPrompt("search-list", inquirerSearchList);
 *
 *     inquirer
 *     .prompt([
 *       {
 *         type: 'search-list',
 *         message: "Select config (listing contents from the '$HOME/.tuizer' directory)",
 *         name: 'selected',
 *         choices: configs.map(c => c.split('/').pop()),
 *       }
 *     ])
 *     .then(function({ selected }) {
 *       const config = configs.filter(c => c.endsWith(selected))[0];
 *       resolve(config as string);
 *     })
 *     .catch(e => reject(e));
 *   });
 * } */

(async () => {
  try {
    // const cliInputFileLocation = getUserInput();
    //
    // let filePath;
    //
    // if (cliInputFileLocation) {
    //   filePath = resolve(process.cwd(), cliInputFileLocation);
    // } else {
    //   const configs = await getHomeConfigs();
    //   const selected = await runSelectionMenu(configs);
    //   filePath = selected;
    // }

    // const { commands, name = '' } = await configFileHandler(filePath);

    // Instantiated a new CommandsService based on a list of commands
    // const commandsService = new CommandsService(commands);

    // start the frontend
    renderUi();
  } catch (error) {
    logger.error(error);
  }
})();
