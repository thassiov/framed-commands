import React, { FC, useEffect } from "react";
import { Box, Text, useStderr, useStdout, Newline } from 'ink';
import {Readable} from "stream";
import {CommandParameter, ICommandDescriptor} from "../../definitions/ICommandDescriptor";

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

type ParameterRendererProps = {
  parameter: CommandParameter;
  newline: boolean;
}

const ParameterRenderer: FC<ParameterRendererProps> = ({ parameter, newline }: ParameterRendererProps) => {
  return (
    <Text>
    {
      typeof parameter == 'string' ?
        <Text> {parameter}</Text>
      :
        <>
          <Text bold color={'white'}> [</Text>
          <Text color={'blue'}>input</Text>
          <Text bold color={'white'}>|</Text>
          { parameter.defaultValue && <Text bold color={'green'}>&apos;{ parameter.defaultValue as string }&apos;</Text>}
          <Text bold color={'white'}>]</Text>
          { parameter.required && <Text bold color={'red'}>*</Text> }
          { newline && <Newline /> }
        </>
    }
    </Text>
  );
}

const Header: FC<HeaderProps> = ({ commandDescriptor }: HeaderProps) => {
  const { description, command, parameters } = commandDescriptor;

  return (
    <Box
    width={'100%'}
    height={parseInt(process.env.MENU_HEIGHT as string) - 1}
    flexDirection={'column'}>
      <Box flexDirection={'column'}>
        <Box>
          <Text bold>Full command</Text>
        </Box>
        <Box alignItems="flex-start">
          <Text>
            <Text>{ command }</Text>
            { parameters.map((parameter, idx) => {
              if (typeof parameter !== 'string' && idx && idx % 2) {
                return (
                  <ParameterRenderer key={idx} parameter={parameter} newline={true} />
                );
              }
              return <ParameterRenderer key={idx} parameter={parameter} newline={false} />;
            })
            }
          </Text>
        </Box>
      </Box>
      <Box flexDirection={'column'} marginTop={1}>
        <Box>
          <Text bold>Description</Text>
        </Box>
        <Box>
          <Text>{ description }</Text>
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
