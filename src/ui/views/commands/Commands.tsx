import {Box, Text, useFocus, useStderr, useStdout} from 'ink';
import React, { FC, useEffect, useRef } from 'react';
import {ICommandDescriptor} from '../../../definitions/ICommandDescriptor';
import { IJSONConfigFile } from '../../../definitions/IJSONConfigFile';

import CommandsService from '../../../services/commands';

import CommandList from '../../components/command-list';

// @TODO this is temporary. Needs to be relocated to the 'definitions' directory
import { CommandData } from '../main/Main';

type CommandsProps = {
  manifest: IJSONConfigFile;
  commandDataNotifier: (commandData?: CommandData) => void;
};

// @NOTE something is causing this to rerender everytime it is focused/unfocused, creating a
// new commandService and this is not very good...
const Commands: FC<CommandsProps> = ({ manifest, commandDataNotifier }: CommandsProps) => {
  const {isFocused} = useFocus({ autoFocus: true });
  const { write: writeStdout } = useStdout();
  const { write: writeStderr } = useStderr();

  const commandsService = useRef(new CommandsService(manifest.commands.length ? manifest.commands : []));

  useEffect(() => {
    commandsService.current = new CommandsService(manifest.commands.length ? manifest.commands : []);
  }, [manifest]);

  const getCommandsService = () => commandsService.current;

  const handleSelect = (commandId: number) => {
    // @TODO handle 'command is running' error. It should prevent the user to run
    // the same command a second time when the first one is still running.
    if (isFocused) {
      runCommand(commandId);
      commandDataNotifier(getCommandDataById(commandId));
    }
  }

  const handleHightlight = (commandId: number) => {
    commandDataNotifier(getCommandDataById(commandId));
  }

  const handleCommandFinishedRunning = (commandId: number) => {
    commandDataNotifier(getCommandDataById(commandId));
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
   borderStyle={isFocused ? 'bold' : 'round'}
   borderColor={isFocused ? 'red' : 'white'}
   flexDirection={'column'}
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
  );
};

export default Commands;
