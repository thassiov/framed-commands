import {Box, Text, useFocus} from 'ink';
import React, { FC } from 'react';
import {ICommandDescriptor} from '../../../definitions/ICommandDescriptor';
import { IJSONConfigFile } from '../../../definitions/IJSONConfigFile';

import CommandsService from '../../../services/commands';

import CommandList from '../../components/command-list';

// @TODO this is temporary. Needs to be relocated to the 'definitions' directory
import { CommandData } from '../main/Main';

type CommandsProps = {
  manifest: IJSONConfigFile;
  setCommandData: React.Dispatch<React.SetStateAction<CommandData | undefined>>
};

const Commands: FC<CommandsProps> = ({ manifest, setCommandData }: CommandsProps) => {
  const {isFocused} = useFocus({ autoFocus: true });

  const commandsService = new CommandsService(manifest.commands.length ? manifest.commands : []);

  const handleSelect = () => {
    if (isFocused) {
      setTimeout(() => console.log('hey'), 3000);
      setCommandData(undefined);
    }
  }

  const handleHightlight = (commandId: number) => {
    const commandData = {
      command: manifest.commands[commandId] as ICommandDescriptor,
      status: commandsService.getCommandById(commandId).getStatus(),
    };

    setCommandData(commandData);
  }

  const getCommandsList = () => commandsService.getCommandList();

  return (
   <Box
   width={'100%'}
   borderStyle={isFocused ? 'bold' : 'round'}
   borderColor={isFocused ? 'red' : 'white'}
   flexDirection={'column'}
   alignSelf={'flex-start'}>
   {
     commandsService.getCommandList().length ?
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
