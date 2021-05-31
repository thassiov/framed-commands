import React, { FC, useEffect } from "react";
import { Box, Text, useStderr, useStdout } from 'ink';
import {Readable} from "stream";
import {ICommandDescriptor} from "../../definitions/ICommandDescriptor";

interface IOutput {
  io: {
    stdout: Readable;
    stderr: Readable;
  }
}

type PresentationPaneProps = {
  commandDescriptor: ICommandDescriptor;
} & IOutput;

type HeaderProps = {
  commandDescriptor: ICommandDescriptor;
};

const Header: FC<HeaderProps> = ({ commandDescriptor }: HeaderProps) => {
  const { description, command, parameters } = commandDescriptor;
  return (
    <Box
    width={'100%'}
    height={4}
    flexDirection="column">
      <Box width={'100%'}>
        <Text bold>Description: </Text>
        <Text>{ description }</Text>
      </Box>
      <Box width={'100%'}>
        <Text bold>Full command: </Text>
        <Text>{ command } { parameters.length ? parameters.join((' ')) : '' }</Text>
      </Box>
    </Box>
  );
}

const PresentationPane: FC<PresentationPaneProps> = ({ commandDescriptor, io }: PresentationPaneProps) => {
  const { write: writeStdout} = useStdout();
  const { write: writeStderr} = useStderr();

  useEffect(() => {
    io?.stdout?.on('data', (chunk) => writeStdout(chunk.toString()));
    io?.stderr?.on('data', (chunk) => writeStderr(chunk.toString()));
  });

  return (
    <Box
    flexDirection="row"
    alignSelf='flex-end'>
      <Header commandDescriptor={commandDescriptor} />
    </Box>
  );
}

export default PresentationPane;