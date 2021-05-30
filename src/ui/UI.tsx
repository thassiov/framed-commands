import React, { FC, useState } from 'react';
import { useInput, Box, useApp } from 'ink';
import  useStdoutDimensions  from 'ink-use-stdout-dimensions';

import {Readable} from 'stream';

import CommandRunner from '../command-runner';
import MenuList from './components/MenuList';
import PresentationPane from './components/PresentationPane';
import {ICommandDescriptor} from '../definitions/ICommandDescriptor';

interface IOutput {
  stdout: Readable;
  stderr: Readable;
}

type OINULL = IOutput & null;

type UIProps = {
  commandRunner: CommandRunner;
};

const UI: FC<UIProps> = ({ commandRunner }: UIProps) => {
  const { exit } = useApp();
  const [highlighted, setHighlighted] = useState(commandRunner.getCommandList()[0] as ICommandDescriptor);
  const [selectedIo, setSelectedIo] = useState(null as OINULL);
  const [columns, rows] = useStdoutDimensions();

  useInput((input) => {
    if (input === 'q') {
      exit();
    }
  });

  const handleSelect = (commandId: number) => {
    const io = commandRunner.runCommand(commandId);
    setSelectedIo(io as OINULL);
  }

  const handleHightlight = (commandId: number) => {
    const command = commandRunner.getCommandList()[commandId];
    setHighlighted(command as ICommandDescriptor);
  }

	return (
    <Box
    height={(rows * 0.10).toString()}
    width={columns}
    borderStyle={'round'}
    borderColor={'greenBright'}
    >
      <MenuList
        commandDescriptors={commandRunner.getCommandList()}
        handleSelect={handleSelect}
        handleHightlight={handleHightlight}
      />
      <PresentationPane
        commandDescriptor={highlighted}
        io={selectedIo}
        />
    </Box>
  );
}

export { UI };
