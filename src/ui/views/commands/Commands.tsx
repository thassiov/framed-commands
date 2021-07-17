import {Box, Text, useFocus} from 'ink';
import React, { FC } from 'react';
import { IJSONConfigFile } from '../../../definitions/IJSONConfigFile';

import CommandsService from '../../../services/commands';

import CommandList from '../../components/command-list';

type CommandsProps = {
  manifest: IJSONConfigFile;
};

const Commands: FC<CommandsProps> = ({ manifest }: CommandsProps) => {
  const {isFocused} = useFocus({ autoFocus: true });

  const commandsService = new CommandsService(manifest.commands.length ? manifest.commands : []);

  const handleSelect = () => {
    if (isFocused) {
      setTimeout(() => console.log('hey'), 3000);
    }
  }

  const getCommandsList = () => commandsService.getCommandList();

  return (
   <Box
   width={'40%'}
   borderStyle={isFocused ? 'bold' : 'round'}
   borderColor={isFocused ? 'red' : 'white'}
   flexDirection={'column'}
   alignSelf={'flex-start'}>
   {
     commandsService.getCommandList().length ?
       <CommandList
         commands={getCommandsList()}
         handleSelect={handleSelect}/>
     :
       <Text>No commands available</Text>
   }
   </Box>
  );
};

export default Commands;
