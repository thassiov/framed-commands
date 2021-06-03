import React, { FC, useState } from 'react';
import { useInput, Box, useApp, Text } from 'ink';
import  useStdoutDimensions  from 'ink-use-stdout-dimensions';

import {Readable} from 'stream';

import CommandRunner from '../command-runner';
import MenuList from './components/MenuList';
import PresentationPane from './components/PresentationPane';
import {ICommandDescriptor, InputParameter} from '../definitions/ICommandDescriptor';
import Form  from './components/Form';

interface IOutput {
  stdout: Readable;
  stderr: Readable;
}

interface IFormInput {
  index: number;
  value: InputParameter
}

type OINULL = IOutput & null;

type UIHeaderProps = {
  name: string;
};

type UIProps = {
  commandRunner: CommandRunner;
} & UIHeaderProps;

const UIHeader: FC<UIHeaderProps> = ({ name }: UIHeaderProps) => {
  const [columns] = useStdoutDimensions();

  const separator = () => {
    return new Array(columns - 2).fill('─');
  }

  return (
    <>
      <Box
      width={'100%'}
      marginBottom={-1}
      justifyContent={'flex-start'}
      paddingX={2}>
        <Text bold color={'cyan'}>{ name }</Text>
      </Box>
      <Box>
        <Text bold color={'blackBright'}> { separator() }</Text>
      </Box>
    </>
  );
}

const UI: FC<UIProps> = ({ commandRunner, name }: UIProps) => {
  const { exit } = useApp();
  const [columns, rows] = useStdoutDimensions();

  const [highlighted, setHighlighted] = useState(commandRunner.getCommandList()[0] as ICommandDescriptor);
  const [selectedIo, setSelectedIo] = useState(null as OINULL);
  const [awaitingForm, setAwaitingForm] = useState(false);
  // this 'parameters' business is not great, but I can't think of a better solution rn
  const [parameters, setParameters] = useState([] as Array<IFormInput>);
  const [currentCommandId, setCurrentCommandId] = useState(-1);

  useInput((input) => {
    if (input === 'q') {
      exit();
    }
  });

  const handleSelect = (commandId: number) => {
    const parameters = commandRunner.getParametersFromCommand(commandId);
    const needInput = parameters
    .map((p, idx) => ({ value: p, index: idx  }))
    .filter(p => typeof p.value != 'string')

    if(needInput.length) {
      setParameters(needInput as Array<IFormInput>);
      setAwaitingForm(true);
      setCurrentCommandId(commandId);
    } else {
      runCommand(commandId);
    }
  }

  const handleAnswer = (answers: Array<IFormInput>) => {
    setAwaitingForm(false);
    const parameters = commandRunner.getParametersFromCommand(currentCommandId);

    answers.forEach(answer => parameters[answer.index] = answer.value);

    commandRunner.setParametersFromCommand(currentCommandId, parameters);
    runCommand(currentCommandId);
  }

  const runCommand = (commandId: number) => {
    const io = commandRunner.runCommand(commandId);
    setSelectedIo(io as OINULL);
  }

  const handleHightlight = (commandId: number) => {
    const command = commandRunner.getCommandList()[commandId];
    setHighlighted(command as ICommandDescriptor);
  }

	return (
    <Box
      height={(rows * 0.20).toString()}
      width={columns}
      borderStyle={'round'}
      borderColor={'greenBright'}
      flexDirection={'column'}>
      { name && <UIHeader name={name} /> }
      <Box>
      {
        awaitingForm ?
            <Form
              parameters={parameters}
              handleAnswer={handleAnswer}
              />
            :
            <>
              <MenuList
                commandDescriptors={commandRunner.getCommandList()}
                handleSelect={handleSelect}
                handleHightlight={handleHightlight} />
              <PresentationPane
                commandDescriptor={highlighted}
                io={selectedIo} />
            </>
      }
      </Box>
    </Box>
  );
}

export { UI };
