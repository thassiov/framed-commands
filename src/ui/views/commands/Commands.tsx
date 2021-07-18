import {Box, Text, useFocus} from 'ink';
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

  const commandsService = useRef(new CommandsService(manifest.commands.length ? manifest.commands : []));

  useEffect(() => {
    commandsService.current = new CommandsService(manifest.commands.length ? manifest.commands : []);
  }, [manifest]);

  const getCommandsService = () => commandsService.current;

  const handleSelect = () => {
    if (isFocused) {
      setTimeout(() => console.log('hey'), 3000);
      commandDataNotifier();
    }
  }

  const handleHightlight = (commandId: number) => {
    const commandData = {
      command: manifest.commands[commandId] as ICommandDescriptor,
      status: getCommandsService().getCommandById(commandId).getStatus(),
    };

    commandDataNotifier(commandData);
  }

  const isCommandListEmpty = () => {
    if (!commandsService) {
      return false;
    }

    return !!getCommandsService().getCommandList().length;
  }

  const getCommandsList = () => getCommandsService().getCommandList();

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
