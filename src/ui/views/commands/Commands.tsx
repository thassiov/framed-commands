import { Box } from 'ink';
import React, { FC, useState } from 'react';
import { Readable } from 'stream';
import { ICommandDescriptor, InputParameter } from '../../../definitions/ICommandDescriptor';

import CommandsService from '../../../services/commands';
import StatusBarService from '../../../services/status-bar';

import CommandDetails from '../../components/command-details';
import CommandList from '../../components/command-list';
import CommandStatus from '../../components/command-status';
import Form from '../../components/form';

interface IFormInput {
  index: number;
  value: InputParameter
}

interface IOutput {
  stdout: Readable;
  stderr: Readable;
}

type OINULL = IOutput & null;

type CommandsProps = {
  commandsService: CommandsService;
  statusBarService: StatusBarService;
};

const Commands: FC<CommandsProps> = ({ commandsService, statusBarService }: CommandsProps) => {
  const [highlighted, setHighlighted] = useState(commandsService.getCommandList()[0] as ICommandDescriptor);
  const [parameters, setParameters] = useState([] as Array<IFormInput>);
  const [awaitingForm, setAwaitingForm] = useState(false);
  const [currentCommandId, setCurrentCommandId] = useState(-1);
  const [selectedIo, setSelectedIo] = useState(null as OINULL);

  // this 'parameters' business is not great, but I can't think of a better solution rn
  const [currentNameAlias, setCurrentNamealias] = useState('');

  const handleSelect = (commandId: number) => {
    const parameters = commandsService.getParametersFromCommand(commandId);
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

  const handleHightlight = (commandId: number) => {
    commandsService.stopListeningtoCommandEvents(commandId);

    const command = commandsService.getCommandList()[commandId];
    setHighlighted(command as ICommandDescriptor);
  }

  const handleAnswer = (answers: Array<IFormInput>) => {
    setAwaitingForm(false);
    const parameters = commandsService.getParametersFromCommand(currentCommandId);

    answers.forEach(answer => parameters[answer.index] = answer.value);

    commandsService.setParametersFromCommand(currentCommandId, parameters);
    runCommand(currentCommandId);
  }

  const handleCommandFinishedRunning = () => {
    setCurrentNamealias('');
    statusBarService.unsetComponent();
  }

  const runCommand = (commandId: number) => {
    setCurrentNamealias((commandsService.getCommandList()[commandId] as ICommandDescriptor).nameAlias)
    const io = commandsService.runCommand(commandId);
    setSelectedIo(io as OINULL);
    statusBarService.setComponent(<CommandStatus commandName={currentNameAlias} />);
    commandsService.listenToCommandEvent(commandId, 'exit', handleCommandFinishedRunning);
    commandsService.listenToCommandEvent(commandId, 'error', handleCommandFinishedRunning);
  }

  const getCommandsList = () => commandsService.getCommandList();

  return (
    <Box>
    {
      awaitingForm ?
        <Form
          parameters={parameters}
          handleAnswer={handleAnswer}/>
        :
        <>
          <CommandList
            commandsList={getCommandsList()}
            handleSelect={handleSelect}
            handleHightlight={handleHightlight} />
          <CommandDetails
            commandDescriptor={highlighted}
            io={selectedIo} />
        </>
    }
    </Box>
  );
};

export default Commands;
