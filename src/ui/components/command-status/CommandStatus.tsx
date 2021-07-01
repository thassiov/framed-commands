import React, { FC } from 'react';

import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

type CommandStatusProps = {
  commandName: string;
};

const CommandStatus: FC<CommandStatusProps> = ({ commandName }: CommandStatusProps) => {
  return (
    <Box>
      <Text color={'blue'}>Running: </Text>
      <Text italic bold>{ commandName } </Text>
      <Spinner type={'point'} />
    </Box>
  );
}

export default CommandStatus;
