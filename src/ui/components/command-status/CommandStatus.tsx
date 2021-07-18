import React, { FC, useEffect, useState } from 'react';

import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

import { CommandData } from '../../views/main/Main';

import { CommandStatus as CommandStatusEnum } from '../../../definitions/CommandStatusEnum';


type CommandStatusProps = {
  commandData: CommandData;
};

const CommandStatus: FC<CommandStatusProps> = ({ commandData }: CommandStatusProps) => {
  const [statusColor, setStatusColor] = useState('blue');

  useEffect(() => {
    switch (commandData.status) {
      case CommandStatusEnum.RUNNING:
        setStatusColor('green');
        break;
      case CommandStatusEnum.ERROR:
        setStatusColor('red');
        break;
      case CommandStatusEnum.KILLED:
      case CommandStatusEnum.STOPPED:
        setStatusColor('orange');
        break;
      default:
        setStatusColor('blue');
        break;
    }
  });

  return (
    <Box
      justifyContent="space-between"
      paddingX={1}>
      <Box>
        <Text italic bold>Command: { commandData.command.nameAlias } </Text>
      </Box>
      <Box>
        <Text>Status: </Text>
        <Text color={statusColor}>{ commandData.status.toUpperCase() } </Text>
        { commandData.status == CommandStatusEnum.RUNNING && <Spinner type={'point'} /> }
      </Box>
    </Box>
  );
}

export default CommandStatus;
