import React from 'react';
import { render } from 'ink';

import Main from './views/main';

import CommandsService from '../services/commands';

function renderUi(commandsService: CommandsService, name: string): void {
  render(
    <>
      { /* manifets list */ }
      <Main commandsService={commandsService} name={name} />
    </>
  );
}

export {
  renderUi,
};
