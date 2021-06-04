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
    height={parseInt(process.env.MENU_HEIGHT as string) - 1}
    flexDirection={'column'}>
      <Box width={80} flexDirection={'column'}>
        <Box>
          <Text bold>Full command</Text>
        </Box>
        <Box>
          <Text>{ command } { parameters.length ? parameters.join((' ')) : '' }</Text>
        </Box>
      </Box>
      <Box width={80} flexDirection={'column'}>
        <Box>
          <Text bold>Description</Text>
        </Box>
        <Box>
          <Text wrap={'wrap'}>{ description }</Text>
        </Box>
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
