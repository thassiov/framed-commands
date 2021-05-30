import React from 'react';
import { render } from 'ink';

import { UI } from './UI';

import CommandRunner from "../command-runner";

function renderUi(commandRunner: CommandRunner, name: string): void {
  render(<UI commandRunner={commandRunner} name={name} />);
}

export {
  renderUi,
};
