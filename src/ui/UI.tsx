import React, { FC, useEffect, useState } from 'react';
import { useInput, Box, useApp, Text, useStdout } from 'ink';
import  useStdoutDimensions  from 'ink-use-stdout-dimensions';
import Spinner from 'ink-spinner';

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

const UIHeader: FC<UIHeaderProps & { commandName: string }> = ({ name, commandName }: UIHeaderProps & { commandName: string }) => {
  const [columns] = useStdoutDimensions();

  const separator = () => {
    return new Array(columns - 2).fill('─');
  }

  return (
    <>
      <Box
      width={'100%'}
      marginBottom={-1}
      justifyContent={'space-between'}
      paddingX={2}>
        <Box>
          <Text bold color={'cyan'}>{ name }</Text>
        </Box>
        {
          commandName ?
            <Box>
              <Text color={'blue'}>Running: </Text>
              <Text italic bold>{ commandName } </Text>
              <Spinner type={'point'} />
            </Box>
          :
            <></>
        }
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
  const { write: writeStdout} = useStdout();
  const [programStarted, setProgramStarted] = useState(false);

  const [highlighted, setHighlighted] = useState(commandRunner.getCommandList()[0] as ICommandDescriptor);
  const [selectedIo, setSelectedIo] = useState(null as OINULL);
  const [awaitingForm, setAwaitingForm] = useState(false);
  // this 'parameters' business is not great, but I can't think of a better solution rn
  const [parameters, setParameters] = useState([] as Array<IFormInput>);
  const [currentCommandId, setCurrentCommandId] = useState(-1);
  const [currentNameAlias, setCurrentNamealias] = useState('');

  useEffect(() => {
    // To make sure the menu starts at the bottom of the screen, a number of empty lines are
    // printed to stdout and it is calculated by the number of lines the screen has in height
    // minus the menu's height.
    if (!programStarted) {
      const emptyLinesToPrint = rows - (parseInt(process.env.MENU_HEIGHT as string));
      new Array(emptyLinesToPrint)
        .fill('\n')
        .forEach(line => writeStdout(line));
      setProgramStarted(true);
    }
  });

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
    setCurrentNamealias((commandRunner.getCommandList()[commandId] as ICommandDescriptor).nameAlias)
    const io = commandRunner.runCommand(commandId);
    setSelectedIo(io as OINULL);
    commandRunner.listenToCommandEvent(commandId, 'exit', handleCommandFinishedRunning);
    commandRunner.listenToCommandEvent(commandId, 'error', handleCommandFinishedRunning);
  }

  const handleCommandFinishedRunning = () => {
    setCurrentNamealias('');
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
      { name && <UIHeader name={name} commandName={currentNameAlias} /> }
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
