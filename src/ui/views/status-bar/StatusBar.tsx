import React, { FC } from "react";
import { Box, Text } from 'ink';
import { CommandData } from "../main/Main";
import CommandStatus from "../../components/command-status";

type StatusBarProps = {
  message?: string;
  commandData?: CommandData;
}

const StatusBar: FC<StatusBarProps> = ({ message, commandData }: StatusBarProps) => {
  return (
    <Box
     width={'100%'}
     borderStyle={'round'}
     borderColor={'white'}
     flexDirection={'column'}
     alignSelf={'flex-start'}>
      { message && <Text>{message}</Text> }
      { commandData && <CommandStatus commandData={commandData} /> }
    </Box>
  );
}

export default StatusBar;
