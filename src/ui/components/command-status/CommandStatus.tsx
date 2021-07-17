import React, { FC } from 'react';

import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

import { CommandData } from '../../views/main/Main';

import { CommandStatus as CommandStatusEnum } from '../../../definitions/CommandStatusEnum';


type CommandStatusProps = {
  commandData: CommandData;
};

const CommandStatus: FC<CommandStatusProps> = ({ commandData }: CommandStatusProps) => {
  return (
    <Box
      justifyContent="space-between"
      paddingX={1}>
      <Box>
        <Text italic bold>Command: { commandData.command.nameAlias } </Text>
      </Box>
      <Box>
        <Text>Status: </Text>
        <Text color={'blue'}>{ commandData.status.toUpperCase() }</Text>
        {
          commandData.status == CommandStatusEnum.RUNNING &&
              <Spinner type={'point'} />
        }
      </Box>
    </Box>
  );
}

export default CommandStatus;
