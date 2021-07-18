import React, { FC } from 'react';
import { Box, Text, Newline } from 'ink';
import { CommandParameter, ICommandDescriptor } from '../../../definitions/ICommandDescriptor';

type PresentationPaneProps = {
  commandDescriptor: ICommandDescriptor;
};

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

const CommandDetails: FC<PresentationPaneProps> = ({ commandDescriptor }: PresentationPaneProps) => {

  return (
    <Box
    flexDirection="row"
    alignSelf='flex-end'>
    {
      commandDescriptor ?
        <Header commandDescriptor={commandDescriptor} />
        :
        <Text>Nothing to see here</Text>
    }
    </Box>
  );
}

export default CommandDetails;
