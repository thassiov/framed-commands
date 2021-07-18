import React, { FC, useEffect, useState } from "react";
import { Box, Text } from 'ink';
import CommandStatus from "../../components/command-status";
import {CommandData} from "../main/Main";

type Dispatcher = React.Dispatch<React.SetStateAction<CommandData | undefined>>;

type StatusBarProps = {
  message?: string;
  commandDataSubscriber?: (dispatcher: Dispatcher) => void;
}

const StatusBar: FC<StatusBarProps> = ({ message, commandDataSubscriber }: StatusBarProps) => {
  const [commandData, setCommandData] = useState<CommandData | undefined>(undefined);

  useEffect(() => {
    if (commandDataSubscriber) {
      commandDataSubscriber(setCommandData);
    }
  });

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
