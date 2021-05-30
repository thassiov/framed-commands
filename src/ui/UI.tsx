import { useInput, Box } from 'ink';
import { exit } from 'process';
import React, { FC, useState } from 'react';
import {Readable} from 'stream';
import CommandRunner from '../command-runner';
import MenuList from './components/MenuList';
import PresentationPane from './components/PresentationPane';

type IUIProps = {
  commandRunner: CommandRunner;
}

interface ICommandListItem {
  nameAlias: string;
  description: string;
}

interface IOutput {
  stdout: Readable;
  stderr: Readable;
}

type ionull = IOutput & null;

const UI: FC<IUIProps> = ({ commandRunner }: IUIProps) => {
  useInput((input) => {
    if (input === 'q') {
      exit(0);
    }
  });

  const [highlighted, setHighlighted] = useState(commandRunner.getCommandList()[0] as ICommandListItem);
  const [selectedIo, setSelectedIo] = useState(null as ionull);

  const handleSelect = (commandId: number) => {
    console.log(commandId);
    const io = commandRunner.runCommand(commandId);
    setSelectedIo(io as ionull);
  }

  const handleHightlight = (commandId: number) => {
    const command = commandRunner.getCommandList()[commandId];
    setHighlighted(command as ICommandListItem);
  }

	return (
    <Box height={'100%'}>
      <MenuList
        commandRunner={commandRunner}
        handleSelect={handleSelect}
        handleHightlight={handleHightlight}
      />
      <PresentationPane
        nameAlias={highlighted.nameAlias}
        description={highlighted.description}
        io={selectedIo}
        />
    </Box>
  );
}

export { UI };
