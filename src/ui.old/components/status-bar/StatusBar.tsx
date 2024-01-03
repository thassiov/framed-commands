import { Box, Text } from 'ink';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import React, { FC } from 'react';

type StatusBarProps = {
  name: string;
  externalComponent: React.ReactElement;
};

const StatusBar: FC<StatusBarProps> = ({ name, externalComponent }: StatusBarProps) => {
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
      { externalComponent }
      </Box>
      { /* status bar separator (a bunch of lines) */ }
      <Box>
        <Text bold color={'blackBright'}> { separator() }</Text>
      </Box>
    </>
  );
};

export default StatusBar;
