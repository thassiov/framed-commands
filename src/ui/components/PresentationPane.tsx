import React, { FC, useEffect, useState } from "react";
import { Box, Text } from 'ink';
import {Readable} from "stream";

interface ICommandListItem {
  nameAlias: string;
  description: string;
}

interface IOutput {
  io: {
    stdout: Readable;
    stderr: Readable;
  }
}

const Header: FC<ICommandListItem> = ({ nameAlias, description }: ICommandListItem) => {
  return (
    <Box width={'100%'} height={4} flexDirection="row" borderStyle={'single'}>
      <Box width={'100%'}>
        <Text bold>{nameAlias}</Text>
      </Box>
      <Box width={'100%'}>
        <Text>{description}</Text>
      </Box>
    </Box>
  );
}

const Output: FC<IOutput> = ({ io }: IOutput) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    io?.stdout?.on('data', (chunk) => setMessage(message + chunk.toString()));
    io?.stderr?.on('data', (chunk) => setMessage(message + chunk.toString()));
  });

  return (
    <Box height={'100%'}>
      <Text>{message}</Text>
    </Box>
  );
}

const PresentationPane: FC<ICommandListItem & IOutput> = ({ nameAlias, description, io }: ICommandListItem & IOutput) => {
  return (
    <Box width={'85%'} borderStyle={'bold'} flexDirection="column">
      <Output io={io} />
      <Header nameAlias={nameAlias} description={description} />
    </Box>
  );
}

export default PresentationPane;
