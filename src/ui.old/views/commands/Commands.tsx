import {Box, Text, useFocus, useStderr, useStdout} from 'ink';
import React, { FC, useEffect, useRef, useState } from 'react';
import {ICommandDescriptor, InputParameter} from '../../../definitions/ICommandDescriptor';
import { IJSONConfigFile } from '../../../definitions/IJSONConfigFile';

import CommandsService from '../../../services/commands';

import CommandList from '../../components/command-list';
import Form from '../../components/form';
import Details from '../details';

// @TODO this is temporary. Needs to be relocated to the 'definitions' directory
import { CommandData } from '../main/Main';

type FormInput = {
  index: number;
  value: InputParameter;
}

type Dispatcher = React.Dispatch<React.SetStateAction<CommandData | undefined>>;

type CommandsProps = {
  manifest: IJSONConfigFile;
  commandDataNotifier: (commandData?: CommandData) => void;
  commandDataSubscriber: (dispatcher: Dispatcher) => void;
};

// @NOTE something is causing this to rerender everytime it is focused/unfocused, creating a
// new commandService and this is not very good...
const Commands: FC<CommandsProps> = ({ manifest, commandDataNotifier, commandDataSubscriber }: CommandsProps) => {
  const { isFocused } = useFocus({ autoFocus: true });
  const { write: writeStdout } = useStdout();
  const { write: writeStderr } = useStderr();

  const [isAwaitingForm, setIsAwaitingForm] = useState(false);
  const [formData, setFormData] = useState<FormInput[]>([]);
  const [currentCommandId, setCurrentCommandId] = useState(-1);

  const commandsService = useRef(new CommandsService(manifest.commands.length ? manifest.commands : []));

  useEffect(() => {
    commandsService.current = new CommandsService(manifest.commands.length ? manifest.commands : []);
  }, [manifest]);

  const getCommandsService = () => commandsService.current;

  const handleSelect = (commandId: number) => {
    // @TODO handle 'command is running' error. It should prevent the user to run
    // the same command a second time when the first one is still running.
    if (isFocused) {
      const parameters = getCommandsService().getParametersFromCommand(commandId);
      const needInput = parameters
        .map((p, idx) => ({ value: p, index: idx  }))
        .filter(p => typeof p.value != 'string')

      if(needInput.length) {
        setFormData(needInput as FormInput[]);
        setIsAwaitingForm(true);
        setCurrentCommandId(commandId);
      } else {
        runCommand(commandId);
        commandDataNotifier(getCommandDataById(commandId));
      }
    }
  }

  const handleHightlight = (commandId: number) => {
    commandDataNotifier(getCommandDataById(commandId));
  }

  const handleCommandFinishedRunning = (commandId: number) => {
    commandDataNotifier(getCommandDataById(commandId));
  }

  const handleFormAnswer = (answers: FormInput[]) => {
    const parameters = getCommandsService().getParametersFromCommand(currentCommandId);

    answers.forEach(answer => parameters[answer.index] = answer.value);

    getCommandsService().setParametersFromCommand(currentCommandId, parameters);
    setIsAwaitingForm(false);
    // @TODO maybe don't clear last form data. idk
    setFormData([]);
    runCommand(currentCommandId);
  }

  const getCommandDataById = (commandId: number) => {
    const commandData = {
      command: manifest.commands[commandId] as ICommandDescriptor,
      status: getCommandsService().getCommandById(commandId).getStatus(),
    };

    return commandData;
  }

  const isCommandListEmpty = () => {
    if (!commandsService) {
      return false;
    }

    return !!getCommandsService().getCommandList().length;
  }

  const getCommandsList = () => getCommandsService().getCommandList();

  const runCommand = (commandId: number) => {
    const io = getCommandsService().runCommand(commandId);
    io.stdout.on('data', (chunk) => writeStdout(chunk.toString()));
    io.stderr.on('data', (chunk) => writeStderr(chunk.toString()));
    getCommandsService().listenToCommandEvent(commandId, 'exit', () => handleCommandFinishedRunning(commandId));
    getCommandsService().listenToCommandEvent(commandId, 'error', () => handleCommandFinishedRunning(commandId));
  }

  return (
    <Box
      width={'100%'}
      flexDirection={'row'}>
      {
        isAwaitingForm ?
          <Form parameters={formData} handleAnswer={handleFormAnswer} />
        :
          <>
            <Box
              width={'50%'}
              borderStyle={isFocused ? 'bold' : 'round'}
              borderColor={isFocused ? 'red' : 'white'}
              flexDirection={'row'}
              alignSelf={'flex-start'}>
              {
                 isCommandListEmpty() ?
                  <CommandList
                    commands={getCommandsList()}
                    handleHightlight={handleHightlight}
                    handleSelect={handleSelect}/>
                :
                  <Text>No commands available</Text>
              }
            </Box>
            <Box
              width={'50%'}>
              <Details commandDataSubscriber={commandDataSubscriber} />
            </Box>
          </>
      }
    </Box>
  );
};

export default Commands;
